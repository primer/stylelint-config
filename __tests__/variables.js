const {lint, extendDefaultConfig} = require('./utils')

describe('primer/variables', () => {
  describe('color properties', () => {
    it(`doesn't run when disabled`, () => {
      return lint(
        `.x { color: #f00; }`,
        extendDefaultConfig({
          rules: {
            'primer/variables': false
          }
        })
      ).then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
    })

    it('reports color properties w/o variables', () => {
      return lint(
        `.x { color: #f00; }`,
        extendDefaultConfig({
          rules: {
            'primer/variables': true
          }
        })
      ).then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarningsLength(1)
        expect(data).toHaveWarnings([`Please use a color variable for "color" instead of "#f00". (primer/variables)`])
      })
    })

    it('does not report color properties with allowed values', () => {
      return lint(
        `.x { background-color: transparent; }`,
        extendDefaultConfig({
          rules: {
            'primer/variables': true
          }
        })
      ).then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
    })

    it('reports properties with invalid variable usage', () => {
      return lint(
        `.x { background-color: $red; }`,
        extendDefaultConfig({
          rules: {
            'primer/variables': true
          }
        })
      ).then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarningsLength(1)
        expect(data).toHaveWarnings([`Please use a background color variable for "background-color" instead of "$red". (primer/variables)`])
      })
    })

    it('does not report properties with any variables (and no allowedVariables)', () => {
      return lint(
        `.x { color: $red; }`,
        extendDefaultConfig({
          rules: {
            'primer/variables': true
          }
        })
      ).then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
    })

    it('does not report properties with valid variables', () => {
      return lint(
        `.x { background-color: $bg-red; }`,
        extendDefaultConfig({
          rules: {
            'primer/variables': true
          }
        })
      ).then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
    })

  })
})
