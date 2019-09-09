const {lint, extendDefaultConfig} = require('./utils')

describe('primer/no-override', () => {
  it('reports instances of utility classes', () => {
    return lint('.text-gray { color: #111; }').then(data => {
      expect(data).toHaveErrored()
      expect(data).toHaveWarningsLength(1)
      expect(data).toHaveWarnings([`".text-gray" should not be overridden (found in utilities). (primer/no-override)`])
    })
  })

  it('reports instances of complete utility selectors', () => {
    const selector = '.show-on-focus:focus'
    return lint(`${selector} { color: #f00; }`).then(data => {
      expect(data).toHaveErrored()
      expect(data).toHaveWarningsLength(1)
      expect(data).toHaveWarnings([`"${selector}" should not be overridden (found in utilities). (primer/no-override)`])
    })
  })

  it('reports instances of partial utility selectors', () => {
    const selector = '.show-on-focus'
    return lint(`.foo ${selector}:focus { color: #f00; }`).then(data => {
      expect(data).toHaveErrored()
      expect(data).toHaveWarningsLength(1)
      expect(data).toHaveWarnings([
        `"${selector}" should not be overridden in ".foo ${selector}:focus" (found in utilities). (primer/no-override)`
      ])
    })
  })

  it('warns when you pass an invalid bundle name', () => {
    const config = extendDefaultConfig({
      rules: {
        'primer/no-override': [true, {bundles: ['asdf']}]
      }
    })
    return lint('.foo { color: #f00; }', config).then(data => {
      expect(data).not.toHaveErrored()
      expect(data.results[0].invalidOptionWarnings).toHaveLength(1)
      expect(data.results[0].invalidOptionWarnings[0]).toEqual({
        text: `The "bundles" option must be an array of valid bundles; got: "asdf"`
      })
    })
  })
})
