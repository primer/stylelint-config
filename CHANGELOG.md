# Changelog

## 12.3.2

### Patch Changes

- [#215](https://github.com/primer/stylelint-config/pull/215) [`66b16ae`](https://github.com/primer/stylelint-config/commit/66b16ae2edd81f8c8949f83c96d7011e5d395cc0) Thanks [@jonrohan](https://github.com/jonrohan)! - Making linter pick up separate function groups

## 12.3.1

### Patch Changes

- [#213](https://github.com/primer/stylelint-config/pull/213) [`2a27f86`](https://github.com/primer/stylelint-config/commit/2a27f86868b1f4717100a1f0897cdaefb1dd6be7) Thanks [@jonrohan](https://github.com/jonrohan)! - Fixing an issue where the new spacing plugin isn't traversing child sectors.

## 12.3.0

### Minor Changes

- [#191](https://github.com/primer/stylelint-config/pull/191) [`71c7985`](https://github.com/primer/stylelint-config/commit/71c79853b679b674c1d27686f8d2168660b24a45) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactoring the primer/spacing plugin to better match results

## 12.2.0

### Minor Changes

- [#170](https://github.com/primer/stylelint-config/pull/170) [`b56fcd1`](https://github.com/primer/stylelint-config/commit/b56fcd1bce90d2e3e1621ef7af7545c52c935579) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving config from primer/css's [stylelint.config.cjs](https://github.com/primer/css/blob/c65be7f0c8b0fb6e1ba406b5d35c6073df161a33/stylelint.config.cjs) file to this package.

* [#168](https://github.com/primer/stylelint-config/pull/168) [`d6ff2b9`](https://github.com/primer/stylelint-config/commit/d6ff2b94ff0d309c1b79e783e6ee1b2f87a375ff) Thanks [@jonrohan](https://github.com/jonrohan)! - Extending stylelint-config-standard and removing defaults

- [#170](https://github.com/primer/stylelint-config/pull/170) [`b56fcd1`](https://github.com/primer/stylelint-config/commit/b56fcd1bce90d2e3e1621ef7af7545c52c935579) Thanks [@jonrohan](https://github.com/jonrohan)! - Adding config from the [stylelint-scss recommended config](https://github.com/stylelint-scss/stylelint-config-recommended-scss/blob/82d51c399ddaa2f9d282e419399dd2028f47830c/index.js).

### Patch Changes

- [#181](https://github.com/primer/stylelint-config/pull/181) [`23e438a`](https://github.com/primer/stylelint-config/commit/23e438a7a9062550baa696cafbb186dc78b723f5) Thanks [@jonrohan](https://github.com/jonrohan)! - Turning off scss/dollar-variable-default

## 12.1.1

### Patch Changes

- [#161](https://github.com/primer/stylelint-config/pull/161) [`48c4afc`](https://github.com/primer/stylelint-config/commit/48c4afc1913863136d62967653697323f8da57b7) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @primer/primitives from 6.1.0 to 7.0.1

## 12.1.0

### Minor Changes

- [#150](https://github.com/primer/stylelint-config/pull/150) [`4af1647`](https://github.com/primer/stylelint-config/commit/4af16474148d96fba5567068280a9ffe6e7a80ba) Thanks [@jonrohan](https://github.com/jonrohan)! - Making all be first in property order

* [#151](https://github.com/primer/stylelint-config/pull/151) [`d7c8b2b`](https://github.com/primer/stylelint-config/commit/d7c8b2b908b113fa14c7637dfced34610a3bcfac) Thanks [@jonrohan](https://github.com/jonrohan)! - Adding [string-quotes](https://stylelint.io/user-guide/rules/list/string-quotes) rule to config

### Patch Changes

- [#146](https://github.com/primer/stylelint-config/pull/146) [`214362c`](https://github.com/primer/stylelint-config/commit/214362c0e3c9449a5ff7d3bd047018493043d3c0) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @primer/css from 13.2.0 to 16.3.0

## 12.0.1

### Patch Changes

- [#132](https://github.com/primer/stylelint-config/pull/132) [`b672367`](https://github.com/primer/stylelint-config/commit/b6723679606bb8d39e75025ae17ace9f1c3e2631) Thanks [@jonrohan](https://github.com/jonrohan)! - Updating no-deprecated-colors plugin for edge cases

## 12.0.0

### Major Changes

- [#129](https://github.com/primer/stylelint-config/pull/129) [`653d596`](https://github.com/primer/stylelint-config/commit/653d596072b897b265b093aac4cd5c143e61410e) Thanks [@jonrohan](https://github.com/jonrohan)! - Renaming the package to use org scope. This is a breaking change, you'll need to uninstall `stylelint-config-primer` and reinstall `@primer/stylelint-config`.

### Patch Changes

- [#130](https://github.com/primer/stylelint-config/pull/130) [`f495a56`](https://github.com/primer/stylelint-config/commit/f495a563a9e809252630466088eb94177e6c0be4) Thanks [@jonrohan](https://github.com/jonrohan)! - Updating @primer/primitives to 5.0 release candidate

## 11.1.1

### Patch Changes

- [`3a4654b`](https://github.com/primer/stylelint-config/commit/3a4654b1b7920d71e1284ff78a3bedff932e66a3) [#111](https://github.com/primer/stylelint-config/pull/111) Thanks [@jonrohan](https://github.com/jonrohan)! - Fixing the primer/colors and primer/borders rules

## 11.1.0

### Minor Changes

- [`e83f61c`](https://github.com/primer/stylelint-config/commit/e83f61cef3bf1df1d9420662594040efdcb86c89) [#99](https://github.com/primer/stylelint-config/pull/99) Thanks [@jonrohan](https://github.com/jonrohan)! - Create a `no-deprecated-colors` rule that looks for deprecated css color variables from primer/primitives.

### Patch Changes

- [`581f40a`](https://github.com/primer/stylelint-config/commit/581f40a4aacb45db5426b82d4a2434e81eb032e2) [#105](https://github.com/primer/stylelint-config/pull/105) Thanks [@jonrohan](https://github.com/jonrohan)! - Adding reporting to the linter to know how many variables are replaced

## 10.0.1

### Patch Changes

- [`aa76171`](https://github.com/primer/stylelint-config/commit/aa76171fc5c9c308fcd9d7f7285c8fbdb2c18a7b) [#90](https://github.com/primer/stylelint-config/pull/90) Thanks [@jonrohan](https://github.com/jonrohan)! - Updating the no-undefined-variables lint for the new color-variables mixin.

## 10.0.0

### Major Changes

- [`23a1f15`](https://github.com/primer/stylelint-config/commit/23a1f1599673f2a4f9f28c39da61f42871c05697) [#85](https://github.com/primer/stylelint-config/pull/85) Thanks [@koddsson](https://github.com/koddsson)! - Replace deprecated "blacklist" rules for "disallow list" rules.

  See https://stylelint.io/user-guide/rules/at-rule-blacklist and http://stylelint.io/user-guide/rules/declaration-property-value-disallowed-list/

### Patch Changes

- [`40d9bb8`](https://github.com/primer/stylelint-config/commit/40d9bb867194ae4335846953b5d8706dc7dc7d79) [#86](https://github.com/primer/stylelint-config/pull/86) Thanks [@koddsson](https://github.com/koddsson)! - Allow rules to optionally display a URL with their message.

## 9.3.3

### Patch Changes

- [`a339c69`](https://github.com/primer/stylelint-config/commit/a339c698b9ba7ccd01b8cb773dad7a3a14dd13a1) [#81](https://github.com/primer/stylelint-config/pull/81) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Update globby to v11

## 9.3.2

### Patch Changes

- [`d18cfbf`](https://github.com/primer/stylelint-config/commit/d18cfbfefc25be6ae38f73132552d2f3c62c4d02) [#79](https://github.com/primer/stylelint-config/pull/79) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Add additional verbose logging to `no-undefined-vars`

* [`d18cfbf`](https://github.com/primer/stylelint-config/commit/d18cfbfefc25be6ae38f73132552d2f3c62c4d02) [#79](https://github.com/primer/stylelint-config/pull/79) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Fix handling of edge-cases in `no-undefined-vars`

- [`bb07673`](https://github.com/primer/stylelint-config/commit/bb076732aa216fcb56e411b8dd7477efc89f7f8a) [#76](https://github.com/primer/stylelint-config/pull/76) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Set the default verbose option for `no-scale-colors` to false

## 9.3.1

### Patch Changes

- [`df11e2d`](https://github.com/primer/stylelint-config/commit/df11e2d912913346e0499f7eac901cdfcb83f38c) [#74](https://github.com/primer/stylelint-config/pull/74) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Add primer/no-scale-colors to the list of exported plugins

## 9.2.1

### :bug: Bug fixes

- Fix slow runtime by caching variable definitions in `primer/no-undefined-vars` rule
- Fix duplicate errors in `primer/no-undefined-vars` rule

## 9.2.0

### :rocket: Enhancements

- New `primer/no-undefined-vars` to prohibit usages of undefined CSS variables

## 9.1.0

### :rocket: Enhancements

- The `primer/colors`, `primer/borders`, and `primer/box-shadow` rules now allow CSS color variables with the correct functional names (e.g. `var(--color-text-primary)`). #62

## 9.0.0

### :boom: Breaking Change

- `primer/variables` is no longer supported; please use the `primer/colors`, `primer/borders`, `primer/box-shadow`, `primer/spacing`, and `primer/typography` rules instead. #50

### :rocket: Enhancements

- The new `primer/colors` rule enforces color variable usage in `color`, `background-color`, and `fill` properties
- The new `primer/borders` rule enforces border variable usage in border CSS props
- The new `primer/box-shadow` rule enforces `$box-shadow*` variables
- The new `primer/spacing` rule enforces `$spacer-*` variables in margin and padding props
- The new `primer/typography` rule enforces typography variable use in `font-family`, `line-height`, and `font-weight` props
- Variable replacements for autofixing are automatically detected in variable data from Primer CSS (see: https://github.com/primer/css/pull/949) #52
- It is now possible to define variable rules using functions that take the variables, as in:
  ```js
  module.exports = createVariableRule('primer/whatever', ({variables}) => {
    /* do something with variables here */
  })
  ```
- It's also now possible to provide rule _overrides_ in local stylelint configs as functions:
  ```js
  module.exports = {
    extends: '@primer/stylelint-config',
    rules: {
      'primer/colors': [true, {
        rules: ({variables, rules}) => {
          /* do something with variables and/or rules here */
          return rules
      }]
    }
  })
  ```
- This release adds support for an optional `singular: true` flag to rule configs, which skips the parsing of individual values in the matched properties. We use this in `primer/box-shadow` to prevent multiple warnings for a single value like `box-shadow: inset 0 1px $blue` (before there would be 4 separate ones!).

### :bug: Bug fixes

- Use `requirePrimerFile()` when loading `dist/variables.json` so that we can access the right file when running _within_ the `@primer/css` repo.
- Walk only declarations (`prop: value`) in rules (blocks with selectors, _not_ `@rules`), and skip linting for declarations nested in `@each`, `@for`, `@function`, and `@mixin` blocks, since those can define their own variables and we can't reliably assert their values.
- Allow `$*-shadow` variable patterns in `primer/box-shadow` to match `$btn-active-shadow` and `$form-control-shadow`
- Allow `color: inherit` in `primer/colors`
- Allow `$em-spacer-*` in `padding` and `margin` properties
- Allow (and auto-fix!) negative spacer variables in `margin` properties
- Make `primer/colors` smarter re: `background` property shorthand values (allowing positions and image `url(*)` values)
- Remove `100%` from allowed values for `border-radius`, and suggest `50%` instead
- Prohibit negative spacer values in `padding` properties
- Allow `$h000-size` for marketing 😬

## 2.0.0

:boom: **The following updates are breaking changes**, since code that disables the deprecated rule will now produce linting errors. Please update your `stylelint-disable` statements accordingly.

- Replaced `selector-no-id: true` with `selector-max-id: 0`
- Replaced `selector-no-type: true` with `selector-max-type: 0`

The rest of the changes should not introduce new linting errors:

- Updated: moved [browserslist](https://github.com/ai/browserslist) spec to `package.json`
- Updated: using the [`no-unsupported-browser-features` plugin](https://github.com/ismay/stylelint-no-unsupported-browser-features) instead of the deprecated `no-unsupported-browser-features` rule
- Removed: `media-feature-no-missing-punctuation`
- Updated: replaced `rule-nested-empty-line-before` and `rule-non-nested-empty-line-before` with `rule-empty-line-before`

## 1.4.0

- Updated: Development dependencies are any version `*`
- Removed: `selector-class-pattern` from config. https://github.com/primer/stylelint-config/pull/11

## 1.3.0

- Added: `length-zero-no-unit` to disallow zero values with units eg `0px`

## 1.2.0

- Removed: We don't need `scss/at-extend-no-missing-placeholder` anymore taken care of by `at-rule-blacklist`
- Added: Adding `selector-no-type` to the rules

## 1.0.0

- Creating a sharable config object
