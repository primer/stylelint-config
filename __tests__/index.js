const {lint} = require('./utils')

const SAFE_SCSS_EXAMPLE = `
  .Component { float: left; }
`

describe('stylelint-config', () => {
  it('stylelint runs with our config', () => {
    return lint('.uppercase { text-transform: uppercase; }').then(data => {
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

  it('generates two warnings with invalid css', () => {
    return lint(`
        .foo {
          width: 10px;
          top: .2em;
        }
      `).then(data => {
      expect(data).toHaveErrored()
      expect(data).toHaveWarningsLength(2)
      expect(data).toHaveWarnings([
        'Expected "top" to come before "width" (order/properties-order)',
        'Expected a leading zero (number-leading-zero)',
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
})
