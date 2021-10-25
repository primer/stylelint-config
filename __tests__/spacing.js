const dedent = require('dedent')
const stylelint = require('stylelint')
const pluginPath = require.resolve('../plugins/spacing')

const ruleName = 'primer/spacing'
const configWithOptions = args => ({
  plugins: [pluginPath],
  rules: {
    [ruleName]: args
  }
})

describe(ruleName, () => {
  it('suggests exact replacements for spacer value', () => {
    return stylelint
      .lint({
        code: `.x { margin: 4px; }`,
        config: configWithOptions(true)
      })
      .then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarningsLength(1)
        expect(data).toHaveWarnings([
          `Please use a spacer variable instead of "4px". See https://primer.style/css/support/spacing. (${ruleName})`
        ])
      })
  })

  it('validates negative margin values', () => {
    return stylelint
      .lint({
        code: dedent`
          .x { margin-top: -$spacer-1; }
          .y { margin: -$spacer-1 -$spacer-2; }
          .z { margin-left: -$em-spacer-4; }
        `,
        config: configWithOptions(true, {verbose: true})
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })

  it('invalidates negative padding values', () => {
    return stylelint
      .lint({
        code: dedent`
          .x { padding-top: -$spacer-1; }
        `,
        config: configWithOptions(true, {verbose: true})
      })
      .then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarningsLength(1)
        expect(data).toHaveWarnings([
          `Please use a non-negative spacer variable instead of "-$spacer-1". See https://primer.style/css/support/spacing. (${ruleName})`
        ])
      })
  })
})
