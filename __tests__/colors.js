const dedent = require('dedent')
const stylelint = require('stylelint')
const pluginPath = require.resolve('../plugins/colors')

const ruleName = 'primer/colors'
const configWithOptions = (...args) => ({
  plugins: [pluginPath],
  syntax: 'scss',
  rules: {
    [ruleName]: args
  }
})

describe(ruleName, () => {
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

  it('does not run when disabled', () => {
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

  it('does not report color properties in at-rules', () => {
    return stylelint
      .lint({
        code: `
          @mixin foo() {
            .x { background-color: #123456; }
          }

          @each $color in $colors {
            @include breakpoint(sm) {
              .text-#{$color} { color: $color; }
            }
          }
        `,
        config: configWithOptions(true),
        syntax: 'scss'
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
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

  it('does not report non-color values in background:', () => {
    return stylelint
      .lint({
        code: `.x { background: red url(derp.png) top right; }`,
        config: configWithOptions(true)
      })
      .then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarningsLength(1)
        expect(data).toHaveWarnings([`Please use a background color variable instead of "red". (${ruleName})`])
      })
  })

  describe('autofix', () => {
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

    it('does not fix other properties', () => {
      return stylelint
        .lint({
          code: dedent`
            .x { border-color: $red-500; }
          `,
          config: configWithOptions(true, {verbose: true}),
          fix: true
        })
        .then(data => {
          expect(data).not.toHaveErrored()
          expect(data).toHaveWarningsLength(0)
          expect(data.output).toEqual(dedent`
            .x { border-color: $red-500; }
          `)
        })
    })
  })

  it('gets chatty with {verbose: true}', () => {
    return stylelint
      .lint({
        code: `.x { color: #f00; }`,
        config: configWithOptions(true, {verbose: true})
      })
      .then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarningsLength(1)
        expect(data).toHaveWarnings([`Please use a text color variable instead of "#f00". (${ruleName})`])
      })
  })

  it('only validates nested declarations once', () => {
    return stylelint
      .lint({
        code: `
          .x {
            .y {
              .z { color: #f00; }
            }
          }
        `,
        config: configWithOptions(true, {verbose: true})
      })
      .then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarningsLength(1)
        expect(data).toHaveWarnings([`Please use a text color variable instead of "#f00". (${ruleName})`])
      })
  })

  it('can override via options.rules', () => {
    return stylelint
      .lint({
        code: `.x { color: #f00; }`,
        config: configWithOptions(true, {
          rules: {
            'text color': false
          }
        })
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })
})
