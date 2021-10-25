const dedent = require('dedent')
const stylelint = require('stylelint')
const pluginPath = require.resolve('../plugins/colors')
const scss = require('postcss-scss')

const ruleName = 'primer/colors'
const configWithOptions = (...args) => ({
  plugins: [pluginPath],
  customSyntax: scss,
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
        expect(data).toHaveWarnings([
          `Please use a text color variable instead of "#f00". See https://primer.style/primitives/colors. (${ruleName})`
        ])
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
        customSyntax: scss
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
        expect(data).toHaveWarnings([
          `Please use a background color variable instead of "$red". See https://primer.style/primitives/colors. (${ruleName})`
        ])
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

  it('does not report properties with valid background color', () => {
    return stylelint
      .lint({
        code: dedent`
        .x { background-color: var(--color-bg-primary); }
        .y { background-color: var(--color-btn-bg-hover); }
        .z { background-color: var(--color-diff-deletion-bg); }
        .a { background-color: var(--color-bg); }
        .a { background-color: var(--color-accent); }
      `,
        config: configWithOptions(true)
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })

  it('does not report properties with valid text color', () => {
    return stylelint
      .lint({
        code: dedent`
          .x { color: var(--color-text-primary); }
          .y { color: var(--color-btn-text-hover); }
          .z { color: var(--color-diff-deletion-text); }
          .a { color: var(--color-fg); }
          .a { color: var(--color-accent); }
        `,
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
        expect(data).toHaveWarnings([
          `Please use a background color variable instead of "red". See https://primer.style/primitives/colors. (${ruleName})`
        ])
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
        expect(data).toHaveWarnings([
          `Please use a text color variable instead of "#f00". See https://primer.style/primitives/colors. (${ruleName})`
        ])
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
        expect(data).toHaveWarnings([
          `Please use a text color variable instead of "#f00". See https://primer.style/primitives/colors. (${ruleName})`
        ])
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
