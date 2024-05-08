import {lint} from './utils/index.js'
import stylelint from 'stylelint'

const SAFE_SCSS_EXAMPLE = `
  .Component { float: left; }
`

describe('stylelint-config', () => {
  it('stylelint runs with our config', () => {
    return lint('.uppercase { text-transform: uppercase; }').then(data => {
      expect(data).not.toHaveErrored()
      expect(data).toHaveResultsLength(1)
    })
  })

  it('produces zero warnings with valid css', () => {
    return lint(`
      .selector-x { width: 10%; }
      .selector-y { width: 20%; }
      .selector-z { width: 30%; }
    `).then(data => {
      expect(data).not.toHaveErrored()
      expect(data).toHaveResultsLength(1)
      expect(data).toHaveWarningsLength(0)
    })
  })

  it('generates two warnings with invalid css', () => {
    return lint(`
        .foo {
          width: 10px;
          top: .2em;
          max-width: initial;
        }
      `).then(data => {
      expect(data).toHaveErrored()
      expect(data).toHaveWarningsLength(3)
      expect(data).toHaveWarnings([
        'Expected "top" to come before "width" (order/properties-order)',
        "Please use a primer size variable instead of '.2em'. Consult the primer docs for a suitable replacement. https://primer.style/foundations/primitives/size (primer/spacing)",
        'Unexpected value "initial" for property "max-width" (declaration-property-value-disallowed-list)',
      ])
    })
  })

  it('does not report any deprecations', () => {
    return lint(SAFE_SCSS_EXAMPLE).then(data => {
      expect(data).not.toHaveErrored()
      expect(data).not.toHaveResultsLength(0)
      expect(data).toHaveDeprecationsLength(0)
    })
  })

  it('resolves css files correctly', async () => {
    const config = await stylelint.resolveConfig('./__fixtures__/good/example.css')
    expect(config).not.toHaveProperty('customSyntax')
  })

  it('resolves tsx files correctly', async () => {
    const config = await stylelint.resolveConfig('./__fixtures__/good/example.tsx')
    expect(config).toHaveProperty('customSyntax', 'postcss-styled-syntax')
  })

  it('resolves scss files correctly', async () => {
    const config = await stylelint.resolveConfig('./__fixtures__/good/example.scss')
    expect(config).toHaveProperty('customSyntax', 'postcss-scss')
  })
})
