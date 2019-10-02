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
          expect(data).toHaveWarnings([`Please use a color (text) variable instead of "#f00". (${ruleName})`])
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
            `Please use a border width variable instead of "1px". (${ruleName})`,
            `Please use a border style variable instead of "solid". (${ruleName})`,
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
})