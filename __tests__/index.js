const config = require('../')
const stylelint = require('stylelint')

const validCss = `
.selector-x { width: 10%; }
.selector-y { width: 20%; }
.selector-z { width: 30%; }
`

const invalidCss = `
.foo {
  color: #fff;
  top: .2em;
}
`

describe('stylelint-config-primer', () => {
  it('stylelint runs with our config', () => {
    return stylelint
      .lint({
        code: 'a { font-weight: bold; }',
        config
      })
      .then(data => {
        expect(data).toBeInstanceOf(Object)
      })
  })

  it('produces zero warnings with valid css', () => {
    return stylelint
      .lint({
        code: validCss,
        config
      })
      .then(data => {
        const {errored, results} = data
        const {warnings} = results[0]
        expect(errored).toBeFalsy()
        expect(warnings).toHaveLength(0)
      })
  })

  it('generates one warning with invalid css', () => {
    return stylelint
      .lint({
        code: invalidCss,
        config
      })
      .then(data => {
        const {errored, results} = data
        const {warnings} = results[0]
        expect(errored).toBeTruthy()
        expect(warnings).toHaveLength(2)
        expect(warnings[0].text).toBe('Expected "top" to come before "color" (order/properties-order)')
        expect(warnings[1].text).toBe('Expected a leading zero (number-leading-zero)')
      })
  })

  it('does not report any deprecations', () => {
    return stylelint
      .lint({
        code: '',
        config,
        syntax: 'scss'
      })
      .then(data => {
        const {errored, results} = data
        expect(errored).toBeFalsy()
        expect(results).not.toHaveLength(0)
        expect(results[0].deprecations).toHaveLength(
          0,
          `Expected there to be no deprecated config warnings. Please fix these:\n\n${results[0].deprecations
            .map(d => d.text)
            .join('\n')}`
        )
      })
  })
})
