const stylelint = require('stylelint')
const ruleName = 'primer/variables'
const pluginPath = require.resolve('../plugins/variables')

const configWithOptions = args => ({
  plugins: [pluginPath],
  rules: {
    [ruleName]: args
  }
})

describe(ruleName, () => {
  describe('color properties', () => {
    it(`doesn't run when disabled`, () => {
      return stylelint
        .lint({
          code: `.x { color: #f00; }`,
          config: configWithOptions(false)
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
        })
    })

    it('reports color properties w/o variables', () => {
      return stylelint
        .lint({
          code: `.x { color: #f00; }`,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).toHaveErrored()
          expect(data).toHaveWarningsLength(1)
          expect(data).toHaveWarnings([`Please use a color variable for "color" instead of "#f00". (primer/variables)`])
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

    it('reports properties with invalid variable usage', () => {
      return stylelint
        .lint({
          code: `.x { background-color: $red; }`,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).toHaveErrored()
          expect(data).toHaveWarningsLength(1)
          expect(data).toHaveWarnings([
            `Please use a background color variable for "background-color" instead of "$red". (primer/variables)`
          ])
        })
    })

    it('does not report properties with any variables (and no allowedVariables)', () => {
      return stylelint
        .lint({
          code: `.x { color: $red; }`,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
        })
    })

    it('does not report properties with valid variables', () => {
      return stylelint
        .lint({
          code: `.x { background-color: $bg-red; }`,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
        })
    })
  })
})
