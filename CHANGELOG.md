# Changelog

## 9.3.3

### Patch Changes

- [`a339c69`](https://github.com/primer/stylelint-config-primer/commit/a339c698b9ba7ccd01b8cb773dad7a3a14dd13a1) [#81](https://github.com/primer/stylelint-config-primer/pull/81) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Update globby to v11

## 9.3.2

### Patch Changes

- [`d18cfbf`](https://github.com/primer/stylelint-config-primer/commit/d18cfbfefc25be6ae38f73132552d2f3c62c4d02) [#79](https://github.com/primer/stylelint-config-primer/pull/79) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Add additinal verbose logging to `no-undefined-vars`

* [`d18cfbf`](https://github.com/primer/stylelint-config-primer/commit/d18cfbfefc25be6ae38f73132552d2f3c62c4d02) [#79](https://github.com/primer/stylelint-config-primer/pull/79) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Fix handling of edge-cases in `no-undefined-vars`

- [`bb07673`](https://github.com/primer/stylelint-config-primer/commit/bb076732aa216fcb56e411b8dd7477efc89f7f8a) [#76](https://github.com/primer/stylelint-config-primer/pull/76) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Set the default verbose option for `no-scale-colors` to false

## 9.3.1

### Patch Changes

- [`df11e2d`](https://github.com/primer/stylelint-config-primer/commit/df11e2d912913346e0499f7eac901cdfcb83f38c) [#74](https://github.com/primer/stylelint-config-primer/pull/74) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Add primer/no-scale-colors to the list of exported plugins

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
    extends: 'stylelint-config-primer',
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
- Removed: `selector-class-pattern` from config. https://github.com/primer/stylelint-config-primer/pull/11

## 1.3.0

- Added: `length-zero-no-unit` to disallow zero values with units eg `0px`

## 1.2.0

- Removed: We don't need `scss/at-extend-no-missing-placeholder` anymore taken care of by `at-rule-blacklist`
- Added: Adding `selector-no-type` to the rules

## 1.0.0

- Creating a sharable config object
