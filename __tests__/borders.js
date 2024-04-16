import dedent from 'dedent'
import stylelint from 'stylelint'
import borders from '../plugins/borders.js'

const ruleName = 'primer/borders'
const configWithOptions = args => ({
  plugins: [borders],
  rules: {
    [ruleName]: args,
  },
})

describe(ruleName, () => {
  it('reports multiple border properties', () => {
    return stylelint
      .lint({
        code: `
          .foo { border: 1px solid gray; }
        `,
        config: configWithOptions(true),
      })
      .then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarnings([
          `Please use "$border-width" instead of "1px". See https://primer.style/css/utilities/borders. (${ruleName})`,
          `Please use "$border-style" instead of "solid". See https://primer.style/css/utilities/borders. (${ruleName})`,
          `Please use a border color variable instead of "gray". See https://primer.style/css/utilities/borders. (${ruleName})`,
        ])
      })
  })

  it('recognizes function calls as whole tokens', () => {
    return stylelint
      .lint({
        code: `
          .foo { border: calc($spacer-2 + var(--derp)) $border-style rgba($border-gray-dark, 50%); }
        `,
        config: configWithOptions(true),
      })
      .then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarnings([
          `Please use a border width variable instead of "calc($spacer-2 + var(--derp))". See https://primer.style/css/utilities/borders. (${ruleName})`,
          `Please use a border color variable instead of "rgba($border-gray-dark, 50%)". See https://primer.style/css/utilities/borders. (${ruleName})`,
        ])
      })
  })

  it('allows $border shorthand in border{,-top,-right,-bottom,-left}', () => {
    return stylelint
      .lint({
        code: dedent`
          .a { border: $border; }
          .b { border-top: $border; }
          .c { border-right: $border; }
          .d { border-bottom: $border; }
          .e { border-left: $border; }
        `,
        config: configWithOptions(true),
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })

  it('does not report properties with valid border color', () => {
    return stylelint
      .lint({
        code: dedent`
          .x { border-color: var(--color-border-primary); }
          .y { border-color: var(--color-btn-border-hover); }
          .z { border-color: var(--color-diff-deletion-border); }
          .a { border-color: var(--color-border); }
          .a { border-color: var(--color-accent); }
        `,
        config: configWithOptions(true),
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })
})
