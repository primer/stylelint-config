const dedent = require('dedent')
const stylelint = require('stylelint')
const pluginPath = require.resolve('../plugins/typography')

const ruleName = 'primer/typography'
const configWithOptions = args => ({
  plugins: [pluginPath],
  rules: {
    [ruleName]: args
  }
})

describe(ruleName, () => {
  describe('font-size', () => {
    it('reports properties w/o variables', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { font-size: 11px; }
            .y { font-size: $spacer-3; }
          `,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).toHaveErrored()
          expect(data).toHaveWarnings([
            `Please use a font-size variable instead of "11px". (${ruleName})`,
            `Please use a font-size variable instead of "$spacer-3". (${ruleName})`
          ])
        })
    })

    it('does not report font size variables', () => {
      return stylelint
        .lint({
          code: dedent`
            .h1 { font-size: $h1-size; }
            .h2 { font-size: $h2-size; }
            small { font-size: $font-size-small; }
          `,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
        })
    })

    it('can fix them', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { font-size: 32px; }
          `,
          config: configWithOptions(true, {verbose: true}),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { font-size: $h1-size; }
          `)
        })
    })
  })
})
