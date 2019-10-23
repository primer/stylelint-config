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
        expect(data).toHaveWarnings([`Please use "$spacer-1" instead of "4px". (${ruleName})`])
      })
  })

  describe('autofix', () => {
    it('fixes padding', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { padding: 4px 8px 0; }
          `,
          config: configWithOptions(true, {verbose: true}),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { padding: $spacer-1 $spacer-2 0; }
          `)
        })
    })

    it('fixes margin', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { margin-top: 4px; margin-right: 8px; }
          `,
          config: configWithOptions(true, {verbose: true}),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { margin-top: $spacer-1; margin-right: $spacer-2; }
          `)
        })
    })

    it('preserves !important', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { margin: 8px !important; }
          `,
          config: configWithOptions(true, {verbose: true}),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { margin: $spacer-2 !important; }
          `)
        })
    })

    it('fixes negative margin values', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { margin-top: -8px; }
          `,
          config: configWithOptions(true, {verbose: true}),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { margin-top: -$spacer-2; }
          `)
        })
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
          `Please use a non-negative spacer variable instead of "-$spacer-1". (${ruleName})`
        ])
      })
  })
})
