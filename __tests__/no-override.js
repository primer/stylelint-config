import {lint, extendDefaultConfig} from './utils'
import noOverride from '../plugins/no-override'

describe('primer/no-override', () => {
  it(`doesn't run when disabled`, () => {
    const config = extendDefaultConfig({
      rules: {
        'primer/no-override': false,
      },
    })
    return lint(`.ml-1 { width: 10px; }`, config).then(data => {
      expect(data).not.toHaveErrored()
      expect(data).toHaveWarningsLength(0)
    })
  })

  it('reports instances of utility classes', () => {
    return lint('.ml-1 { width: 10px; }').then(data => {
      expect(data).toHaveErrored()
      expect(data).toHaveWarningsLength(1)
      expect(data).toHaveWarnings([
        `".ml-1" should not be overridden (defined in @primer/css/utilities). (primer/no-override)`,
      ])
    })
  })

  it('reports instances of complete utility selectors', () => {
    const selector = '.show-on-focus:focus'
    return lint(`${selector} { width: 10px; }`).then(data => {
      expect(data).toHaveErrored()
      expect(data).toHaveWarningsLength(1)
      expect(data).toHaveWarnings([
        `"${selector}" should not be overridden (defined in @primer/css/utilities). (primer/no-override)`,
      ])
    })
  })

  it('reports instances of partial utility selectors', () => {
    const selector = '.show-on-focus'
    return lint(`.foo ${selector}:focus { width: 10px; }`).then(data => {
      expect(data).toHaveErrored()
      expect(data).toHaveWarningsLength(1)
      expect(data).toHaveWarnings([
        `"${selector}" should not be overridden in ".foo ${selector}:focus" (defined in @primer/css/utilities). (primer/no-override)`,
      ])
    })
  })

  it('only reports class selectors', () => {
    const config = {
      plugins: [noOverride],
      rules: {
        'primer/no-override': [true, {bundles: ['base']}],
      },
    }
    return lint(`body { width: 10px; }`, config).then(data => {
      expect(data).not.toHaveErrored()
      expect(data).toHaveWarningsLength(0)
    })
  })

  describe('ignoreSelectors option', () => {
    it('ignores selectors listed as strings', () => {
      const config = extendDefaultConfig({
        rules: {
          'primer/no-override': [
            true,
            {
              bundles: ['utilities'],
              ignoreSelectors: ['.px-4'],
            },
          ],
        },
      })
      return lint(`.px-4 { margin: 0 $spacer-1 !important; }`, config).then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
    })

    it('ignores selectors listed as regular expressions', () => {
      const config = extendDefaultConfig({
        rules: {
          'primer/no-override': [
            true,
            {
              bundles: ['utilities'],
              ignoreSelectors: [/\.px-[0-9]/],
            },
          ],
        },
      })
      return lint(`.px-4 { margin: 0 $spacer-1 !important; }`, config).then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
    })

    it('ignores selectors when ignoreSelectors is a function', () => {
      const config = extendDefaultConfig({
        rules: {
          'primer/no-override': [
            true,
            {
              bundles: ['utilities'],
              ignoreSelectors: selector => selector === '.px-4',
            },
          ],
        },
      })
      return lint(`.px-4 { margin: 0 $spacer-1 !important; }`, config).then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
    })
  })

  describe('invalid options', () => {
    it('warns when you bundles is not an array', () => {
      const config = extendDefaultConfig({
        rules: {
          'primer/no-override': [true, {bundles: 'derp'}],
        },
      })
      return lint('.foo { width: 10px; }', config).then(data => {
        expect(data).not.toHaveErrored()
        expect(data.results[0].invalidOptionWarnings).toEqual([
          {
            text: `The "bundles" option must be an array of valid bundles; got: (not an array)`,
          },
        ])
      })
    })

    it('warns when you pass an invalid bundle name', () => {
      const config = extendDefaultConfig({
        rules: {
          'primer/no-override': [true, {bundles: ['asdf']}],
        },
      })
      return lint('.foo { width: 10px; }', config).then(data => {
        expect(data).not.toHaveErrored()
        expect(data.results[0].invalidOptionWarnings).toEqual([
          {
            text: `The "bundles" option must be an array of valid bundles; got: "asdf"`,
          },
        ])
      })
    })
  })
})
