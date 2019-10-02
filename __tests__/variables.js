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
    it('reports color properties w/o variables', () => {
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

  describe('color properties', () => {
    it('reports color properties w/o variables', () => {
      return stylelint
        .lint({
          code: `.x { color: #f00; }`,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).toHaveErrored()
          expect(data).toHaveWarningsLength(1)
          expect(data).toHaveWarnings([`Please use a text color variable instead of "#f00". (${ruleName})`])
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
  })

  it('reports properties with wrong variable usage', () => {
    return stylelint
      .lint({
        code: `.x { background-color: $red; }`,
        config: configWithOptions(true)
      })
      .then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarningsLength(1)
        expect(data).toHaveWarnings([`Please use a background color variable instead of "$red". (${ruleName})`])
      })
  })

  describe('borders', () => {
    it('reports compound border properties', () => {
      return stylelint
        .lint({
          code: `
            .foo { border: $red; }
          `,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).toHaveErrored()
          expect(data).toHaveWarnings([`Please use a border variable instead of "$red". (${ruleName})`])
        })
    })

    it('reports multiple border properties', () => {
      return stylelint
        .lint({
          code: `
            .foo { border: 1px solid gray; }
          `,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).toHaveErrored()
          expect(data).toHaveWarnings([
            `Please use "$border-width" instead of "1px". (${ruleName})`,
            `Please use "$border-style" instead of "solid". (${ruleName})`,
            `Please use a border color variable instead of "gray". (${ruleName})`
          ])
        })
    })

    it('recognizes function calls as whole tokens', () => {
      return stylelint
        .lint({
          code: `
            .foo { border: calc($spacer-2 + var(--derp)) $border-style rgba($border-gray-dark, 50%); }
          `,
          config: configWithOptions(true)
        })
        .then(data => {
          expect(data).toHaveErrored()
          expect(data).toHaveWarnings([
            `Please use a border width variable instead of "calc($spacer-2 + var(--derp))". (${ruleName})`,
            `Please use a border color variable instead of "rgba($border-gray-dark, 50%)". (${ruleName})`
          ])
        })
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

    it('fixes border variables', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { border: 1px solid $gray-300; }
          `,
          config: configWithOptions(true),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { border: $border-width $border-style $border-gray-dark; }
          `)
        })
    })

    it('fixes border radius', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { border-radius: 3px; }
            .y {
              border-top-left-radius: 3px;
              border-bottom-left-radius: 3px;
            }
          `,
          config: configWithOptions(true),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { border-radius: $border-radius; }
            .y {
              border-top-left-radius: $border-radius;
              border-bottom-left-radius: $border-radius;
            }
          `)
        })
    })

    it('fixes text colors', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { color: $red-600; }
            .y { color: $purple; }
          `,
          config: configWithOptions(true),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { color: $text-red; }
            .y { color: $text-purple; }
          `)
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

    it('fixes background colors', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { background-color: $red-500; }
          `,
          config: configWithOptions(true, {verbose: true}),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { background-color: $bg-red; }
          `)
        })
    })
  })
})
