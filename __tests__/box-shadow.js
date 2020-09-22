const dedent = require('dedent')
const stylelint = require('stylelint')
const pluginPath = require.resolve('../plugins/box-shadow')

const ruleName = 'primer/box-shadow'
const configWithOptions = args => ({
  plugins: [pluginPath],
  rules: {
    [ruleName]: args
  }
})

describe(ruleName, () => {
  it('works', () => {
    return stylelint
      .lint({
        code: `.x { box-shadow: 0 1px 1px rgba($black, 0.1); }`,
        config: configWithOptions(true)
      })
      .then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarningsLength(1)
        expect(data).toHaveWarnings([
          `Please use "$box-shadow" instead of "0 1px 1px rgba($black, 0.1)". (${ruleName})`
        ])
      })
  })

  it('does not report properties with valid shadow variable (prefix) ', () => {
    return stylelint
      .lint({
        code: `.x { box-shadow: var(--color-shadow-canvas); }`,
        config: configWithOptions(true)
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })

  it('does not report properties with valid shadow variable (infix)', () => {
    return stylelint
      .lint({
        code: `.x { box-shadow: var(--color-btn-shadow-hover); }`,
        config: configWithOptions(true)
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })

  it('does not report properties with valid shadow variable (suffix)', () => {
    return stylelint
      .lint({
        code: `.x { box-shadow: var(--color-diff-deletion-shadow); }`,
        config: configWithOptions(true)
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })

  describe('autofix', () => {
    it('fixes box shadow variables', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { box-shadow: 0 1px 1px rgba($black, 0.1); }
          `,
          config: configWithOptions(true),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { box-shadow: $box-shadow; }
          `)
        })
    })
  })
})
