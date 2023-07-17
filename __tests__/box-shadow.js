const dedent = require('dedent')
const stylelint = require('stylelint')
const pluginPath = require.resolve('../plugins/box-shadow')

const ruleName = 'primer/box-shadow'
const configWithOptions = args => ({
  plugins: [pluginPath],
  rules: {
    [ruleName]: args,
  },
})

describe(ruleName, () => {
  it('does not report properties with valid shadow', () => {
    return stylelint
      .lint({
        code: dedent`
          .x { box-shadow: var(--color-shadow-primary); }
          .y { box-shadow: var(--color-btn-shadow-hover); }
          .z { box-shadow: var(--color-diff-deletion-shadow); }
          .a { box-shadow: var(--color-shadow); }
        `,
        config: configWithOptions(true),
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })
})
