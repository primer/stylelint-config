const {lint, extendDefaultConfig} = require('./utils')

describe('primer/variables', () => {

  describe('color properties', () => {

    it('reports color properties w/o variables', () => {
      return lint(`.x { color: #f00; }`, extendDefaultConfig({
        rules: {
          'primer/variables': true
        }
      })).then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarningsLength(1)
        expect(data).toHaveWarnings([`Please use a color variable for "color" instead of "#f00". (primer/variables)`])
      })
    })

    it('does not report color properties with allowed values', () => {
      return lint(`.x { background-color: transparent; }`, extendDefaultConfig({
        rules: {
          'primer/variables': true
        }
      })).then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
    })

  })

})

