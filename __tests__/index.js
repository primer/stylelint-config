const {lint, extendDefaultConfig} = require('./utils')

const SAFE_SCSS_EXAMPLE = `
  .Component { color: $gray-500; }
`

describe('stylelint-config-primer', () => {
  it('stylelint runs with our config', () => {
    return lint('.bold { font-weight: bold; }').then(data => {
      expect(data).not.toHaveErrored()
      expect(data).toHaveResultsLength(1)
    })
  })

  it('produces zero warnings with valid css', () => {
    return lint(`
      .selector-x { width: 10%; }
      .selector-y { width: 20%; }
      .selector-z { width: 30%; }
    `).then(data => {
      expect(data).not.toHaveErrored()
      expect(data).toHaveResultsLength(1)
      expect(data).toHaveWarningsLength(0)
    })
  })

  it('generates one warning with invalid css', () => {
    return lint(`
        .foo {
          color: #fff;
          top: .2em;
        }
      `).then(data => {
      expect(data).toHaveErrored()
      expect(data).toHaveWarningsLength(2)
      expect(data).toHaveWarnings([
        'Expected "top" to come before "color" (order/properties-order)',
        'Expected a leading zero (number-leading-zero)'
      ])
    })
  })

  it('does not report any deprecations', () => {
    return lint(SAFE_SCSS_EXAMPLE).then(data => {
      expect(data).not.toHaveErrored()
      expect(data).not.toHaveResultsLength(0)
      expect(data).toHaveDeprecationsLength(0)
    })
  })

  it('warns about the planned deprecation of primer/selector-no-utility', () => {
    return lint(
      SAFE_SCSS_EXAMPLE,
      extendDefaultConfig({
        rules: {
          'primer/selector-no-utility': true
        }
      })
    ).then(data => {
      expect(data).not.toHaveErrored()
      expect(data).not.toHaveResultsLength(0)
      expect(data).toHaveDeprecationsLength(1)
      expect(data.results[0].deprecations).toEqual([
        {
          text: `'primer/selector-no-utility' has been deprecated and will be removed in stylelint-config-primer@7.0.0. Please update your rules to use 'primer/no-override'.`,
          reference: 'https://github.com/primer/stylelint-config-primer#deprecations'
        }
      ])
    })
  })
})
