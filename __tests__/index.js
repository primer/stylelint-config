const config = require('../')
const stylelint = require('stylelint')

describe('stylelint-config-primer', () => {
  it('stylelint runs with our config', () => {
    return stylelint
      .lint({
        code: '.bold { font-weight: bold; }\n',
        config
      })
      .then(data => {
        expect(data).toBeInstanceOf(Object)
        const {errored, results} = data
        expect(errored).toBe(false)
        expect(results).toHaveLength(1)
      })
  })

  it('produces zero warnings with valid css', () => {
    return stylelint
      .lint({
        code: `
.selector-x { width: 10%; }
.selector-y { width: 20%; }
.selector-z { width: 30%; }
`,
        config
      })
      .then(data => {
        const {errored, results} = data
        const {warnings} = results[0]
        expect(errored).toBe(false)
        expect(warnings).toHaveLength(0)
      })
  })

  it('generates one warning with invalid css', () => {
    return stylelint
      .lint({
        code: `
.foo {
  color: #fff;
  top: .2em;
}
`,
        config
      })
      .then(data => {
        const {errored, results} = data
        const {warnings} = results[0]
        expect(errored).toBe(true)
        expect(warnings).toHaveLength(2)
        expect(warnings[0].text.trim()).toBe('Expected "top" to come before "color" (order/properties-order)')
        expect(warnings[1].text.trim()).toBe('Expected a leading zero (number-leading-zero)')
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
        expect(errored).toBe(false)
        expect(results).not.toHaveLength(0)
        expect(results[0].deprecations).toHaveLength(
          0,
          `Expected there to be no deprecated config warnings. Please fix these:\n\n${results[0].deprecations
            .map(d => d.text)
            .join('\n')}`
        )
      })
  })

  it('reports instances of utility classes', () => {
    return stylelint
      .lint({
        code: '.text-gray { color: #111; }\n',
        config,
        syntax: 'scss'
      })
      .then(data => {
        const {errored, results} = data
        const {warnings} = results[0]
        expect(errored).toBe(true)
        expect(warnings).toHaveLength(1)
        expect(warnings[0].text.trim()).toBe(
          'Avoid styling the utility class selector ".text-gray" (primer/no-override)'
        )
      })
  })
})
