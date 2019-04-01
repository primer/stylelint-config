const {lint, extendDefaultConfig} = require('./utils')

describe('primer/no-override', () => {
  it('reports instances of utility classes', () => {
    return lint('.text-gray { color: #111; }').then(data => {
      expect(data).toHaveErrored()
      expect(data).toHaveWarningsLength(1)
      expect(data).toHaveWarnings([`The selector ".text-gray" should not be overridden. (primer/no-override)`])
    })
  })

  it('reports instances of complete utility selectors', () => {
    const selector = '.show-on-focus:focus'
    return lint(`${selector} { color: #f00; }`).then(data => {
      expect(data).toHaveErrored()
      expect(data).toHaveWarningsLength(1)
      expect(data).toHaveWarnings([`The selector "${selector}" should not be overridden. (primer/no-override)`])
    })
  })
})

