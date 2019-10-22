const stylelint = require('stylelint')
const {createVariableRule, reverseAssignments} = require('../plugins/lib/variable-rules')

describe('reverseAssignments()', () => {
  it('works', () => {
    expect(
      reverseAssignments(`
      $spacer-1: 8px !default;
      $h0-size: 30px !default;
      $h6-size: 12px !default;
    `)
    ).toEqual({
      '8px': '$spacer-1',
      '30px': '$h0-size',
      '12px': '$h6-size'
    })
  })
})

xdescribe('createVariableRule()', () => {
  function configWithRule(ruleName, config, options) {
    return {
      plugins: [createVariableRule(ruleName, config)],
      rules: {
        [ruleName]: options
      }
    }
  }

  it(`doesn't run when disabled`, () => {
    return stylelint
      .lint({
        code: `.x { color: #f00; }`,
        config: configWithRule(
          'primer/test',
          {
            test: {
              props: 'color',
              values: '$text-*'
            }
          },
          false
        )
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })

  it(`doesn't reject properties we don't care about`, () => {
    return stylelint
      .lint({
        code: `.x { display: block; }`,
        config: configWithOptions(true)
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })

  describe('spacing values', () => {
    it('suggests exact replacements for spacer value', () => {
      return stylelint
        .lint({
          code: `.x { margin: 4px; }`,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).toHaveErrored()
          expect(data).toHaveWarningsLength(1)
          expect(data).toHaveWarnings([`Please use "$spacer-1" instead of "4px". (${ruleName})`])
        })
    })
  })

  describe('font-size', () => {
    it('reports color properties w/o variables', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { font-size: 11px; }
            .y { font-size: $spacer-3; }
          `,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).toHaveErrored()
          expect(data).toHaveWarnings([
            `Please use a font-size variable instead of "11px". (${ruleName})`,
            `Please use a font-size variable instead of "$spacer-3". (${ruleName})`
          ])
        })
    })

    it('does not report font size variables', () => {
      return stylelint
        .lint({
          code: dedent`
            .h1 { font-size: $h1-size; }
            .h2 { font-size: $h2-size; }
            .h3-mobile { font-size: $h3-size-mobile; }
            small { font-size: $font-size-small; }
          `,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
        })
    })

    it('can fix them', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { font-size: 32px; }
          `,
          config: configWithOptions(true, {verbose: true}),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { font-size: $h1-size; }
          `)
        })
    })
  })

  describe('color properties', () => {
    it('reports color properties w/o variables', () => {
      return stylelint
        .lint({
          code: `.x { color: #f00; }`,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).toHaveErrored()
          expect(data).toHaveWarningsLength(1)
          expect(data).toHaveWarnings([`Please use a text color variable instead of "#f00". (${ruleName})`])
        })
    })

    it('does not report color properties with allowed values', () => {
      return stylelint
        .lint({
          code: `.x { background-color: transparent; }`,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
        })
    })
  })
})
