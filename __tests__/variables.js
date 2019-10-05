const dedent = require('dedent')
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

  it(`doesn't reject properties we don't care about`, () => {
    return stylelint
      .lint({
        code: `.x { display: block; }`,
        config: configWithOptions(false)
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })

  describe('spacing values', () => {
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
  })

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
            .h3-mobile { font-size: $h3-size-mobile; }
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



  describe('autofix', () => {
    it('fixes spacer variables', () => {
      return stylelint
        .lint({
          code: `.x { margin-top: 8px; }`,
          config: configWithOptions(true),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(`.x { margin-top: $spacer-2; }`)
        })
    })


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

  })
})
