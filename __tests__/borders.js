const dedent = require('dedent')
const stylelint = require('stylelint')
const pluginPath = require.resolve('../plugins/borders')

const ruleName = 'primer/borders'
const configWithOptions = args => ({
  plugins: [pluginPath],
  rules: {
    [ruleName]: args
  }
})

describe(ruleName, () => {
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

  describe('autofix', () => {
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
  })
})
