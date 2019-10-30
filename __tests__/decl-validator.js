const declarationValidator = require('../plugins/lib/decl-validator')

describe('declarationValidator()', () => {
  it('validates values', () => {
    const validate = declarationValidator({
      'border-width': {
        values: '$border-width*',
        replacements: {'1px': '$border-width'}
      }
    })
    expect(validate({prop: 'border-width', value: '2px'})).toEqual({
      valid: false,
      errors: [`Please use a border-width value instead of "2px"`],
      fixable: false,
      replacement: undefined
    })
  })

  it('returns {valid: true} for untested props', () => {
    const validate = declarationValidator({
      color: {values: ['red', 'blue']}
    })
    expect(validate({prop: 'margin', value: '0'})).toEqual({valid: true})
  })

  it('returns {valid: true} for exact value matches', () => {
    const validate = declarationValidator({
      margin: {values: '0'}
    })
    expect(validate({prop: 'margin', value: '0'})).toMatchObject({valid: true})
  })

  it('returns {valid: true} for multiple value matches', () => {
    const validate = declarationValidator({
      margin: {values: ['0', 'auto']}
    })
    expect(validate({prop: 'margin', value: '0 auto 0 auto'})).toMatchObject({valid: true})
  })

  it('replaces multiple value matches', () => {
    const validate = declarationValidator({
      margin: {
        values: ['0', 'auto', '$spacer-*'],
        replacements: {
          '4px': '$spacer-1',
          '8px': '$spacer-2'
        }
      }
    })
    expect(validate({prop: 'margin', value: '0 4px 0 8px'})).toEqual({
      valid: false,
      fixable: true,
      errors: [`Please use "$spacer-1" instead of "4px"`, `Please use "$spacer-2" instead of "8px"`],
      replacement: '0 $spacer-1 0 $spacer-2'
    })
  })

  it('uses the key in the message', () => {
    const validate = declarationValidator({
      derp: {
        props: 'border-width',
        values: '$border-width*',
        replacements: {'1px': '$border-width'}
      }
    })
    expect(validate({prop: 'border-width', value: '2px'})).toEqual({
      valid: false,
      errors: [`Please use a derp value instead of "2px"`],
      fixable: false,
      replacement: undefined
    })
  })

  it('respects the "expects" option', () => {
    const validate = declarationValidator({
      'border-width': {
        expects: 'a thingy thing',
        props: 'border-width',
        values: '$border-width*',
        replacements: {'1px': '$border-width'}
      }
    })
    expect(validate({prop: 'border-width', value: '2px'})).toEqual({
      valid: false,
      errors: [`Please use a thingy thing instead of "2px"`],
      fixable: false,
      replacement: undefined
    })
  })

  describe('components', () => {
    const validate = declarationValidator({
      border: {
        values: '$border',
        replacements: {
          '$border-width $border-style $border-gray': '$border',
          '$border-style $border-width $border-gray': '$border'
        },
        components: ['border-width', 'border-style', 'border-color']
      },
      'border-width': {
        values: '$border-width*',
        replacements: {'1px': '$border-width'}
      },
      'border-style': {
        values: '$border-style*',
        replacements: {solid: '$border-style'}
      },
      'border-color': {
        expects: 'a "$border-{color}" variable',
        values: '$border-{black,white,gray,blue,green,red,purple,yellow}*',
        replacements: {
          '$gray-200': '$border-gray',
          '$gray-300': '$border-gray-dark'
        }
      },
      all: {
        expects: '"unset"',
        values: 'unset',
        components: ['non-existent']
      }
    })

    it('validates multiple components in the right order', () => {
      expect(validate({prop: 'border', value: '1px solid $gray-300'})).toEqual({
        valid: false,
        errors: [
          `Please use "$border-width" instead of "1px"`,
          `Please use "$border-style" instead of "solid"`,
          `Please use "$border-gray-dark" instead of "$gray-300"`
        ],
        fixable: true,
        replacement: '$border-width $border-style $border-gray-dark'
      })
    })

    it('validates a partial list of components (2 of 3)', () => {
      expect(validate({prop: 'border', value: '1px solid'})).toEqual({
        valid: false,
        errors: [`Please use "$border-width" instead of "1px"`, `Please use "$border-style" instead of "solid"`],
        fixable: true,
        replacement: '$border-width $border-style'
      })
    })

    it('suggests a full replacement after component replacements', () => {
      expect(validate({prop: 'border', value: '1px solid $gray-200'})).toEqual({
        valid: false,
        errors: [`Please use "$border" instead of "1px solid $gray-200"`],
        fixable: true,
        replacement: '$border'
      })
    })

    it('uses the component "expects" string', () => {
      expect(validate({prop: 'border', value: '1px solid red'})).toEqual({
        valid: false,
        errors: [
          `Please use "$border-width" instead of "1px"`,
          `Please use "$border-style" instead of "solid"`,
          `Please use a "$border-{color}" variable instead of "red"`
        ],
        fixable: true,
        replacement: '$border-width $border-style red'
      })
    })

    it('invalidates components without a matching rule', () => {
      expect(validate({prop: 'all', value: 'derp'})).toEqual({
        valid: false,
        errors: [`Please use "unset" instead of "derp"`],
        fixable: false,
        replacement: undefined
      })
    })
  })
})
