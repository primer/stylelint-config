const {join} = require('path')
const dedent = require('dedent')
const stylelint = require('stylelint')
const defaultConfig = require('../')

const lint = (code, config = defaultConfig, options = {}) => {
  return stylelint.lint(
    Object.assign(options, {
      code: dedent(code) + '\n',
      config
    })
  )
}

describe('stylelint-config-primer', () => {
  it('stylelint runs with our config', () => {
    return lint('.bold { font-weight: bold; }').then(data => {
      expect(data).toBeInstanceOf(Object)
      const {errored, results} = data
      expect(errored).toBe(false)
      expect(results).toHaveLength(1)
    })
  })

  it('produces zero warnings with valid css', () => {
    return lint(`
        .selector-x { width: 10%; }
        .selector-y { width: 20%; }
        .selector-z { width: 30%; }
      `).then(data => {
      const {errored, results} = data
      const {warnings} = results[0]
      expect(warnings).toHaveLength(0)
      expect(errored).toBe(false)
    })
  })

  it('generates one warning with invalid css', () => {
    return lint(`
        .foo {
          color: #fff;
          top: .2em;
        }
      `).then(data => {
      const {errored, results} = data
      const {warnings} = results[0]
      expect(errored).toBe(true)
      expect(warnings).toHaveLength(2)
      expect(warnings[0].text.trim()).toBe('Expected "top" to come before "color" (order/properties-order)')
      expect(warnings[1].text.trim()).toBe('Expected a leading zero (number-leading-zero)')
    })
  })

  it('does not report any deprecations', () => {
    return lint('').then(data => {
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

  it('warns about the planned deprecation of primer/selector-no-utility', () => {
    return lint('', {
      extends: join(__dirname, '..'),
      rules: {
        'primer/selector-no-utility': true
      }
    }).then(data => {
      const {errored, results} = data
      expect(errored).toBe(false)
      expect(results).not.toHaveLength(0)
      expect(results[0].deprecations).toEqual([
        {
          text: `'primer/selector-no-utility' has been deprecated and will be removed in stylelint-config-primer@7.0.0. Please update your rules to use 'primer/no-override'.`,
          reference: 'https://github.com/primer/stylelint-config-primer#deprecations'
        }
      ])
    })
  })

  it('reports instances of utility classes', () => {
    return lint('.text-gray { color: #111; }').then(data => {
      const {errored, results} = data
      const {warnings} = results[0]
      expect(errored).toBe(true)
      expect(warnings).toHaveLength(1)
      expect(warnings[0].text.trim()).toBe(`The selector ".text-gray" should not be overridden. (primer/no-override)`)
    })
  })

  it('reports instances of complete utility selectors', () => {
    const selector = '.show-on-focus:focus'
    return lint(`${selector} { color: #f00; }`).then(data => {
      const {errored, results} = data
      const {warnings} = results[0]
      expect(errored).toBe(true)
      expect(warnings).toHaveLength(1)
      expect(warnings[0].text.trim()).toBe(`The selector "${selector}" should not be overridden. (primer/no-override)`)
    })
  })
})
