# Primer stylelint plugins

This directory contains all of our custom stylelint plugins, each of which provides a single stylelint rule.

### Rules

- [Primer stylelint plugins](#primer-stylelint-plugins)
    - [Rules](#rules)
  - [Usage](#usage)
  - [`primer/no-override`](#primerno-override)
  - [`primer/no-unused-vars`](#primerno-unused-vars)
  - [`primer/no-deprecated-colors`](#primerno-deprecated-colors)
  - [`primer/no-undefined-vars`](#primerno-undefined-vars)
  - [`primer/no-scale-colors`](#primerno-scale-colors)
  - [`primer/colors`](#primercolors)
  - [`primer/spacing`](#primerspacing)
  - [`primer/typography`](#primertypography)
  - [`primer/borders`](#primerborders)
  - [`primer/box-shadow`](#primerbox-shadow)
  - [`primer/responsive-widths`](#primerresponsive-widths)
  - [`primer/utilities`](#primerutilities)
  - [Variable rules](#variable-rules)
    - [Variable rule options](#variable-rule-options)

These were intended for use with [Primer CSS] and GitHub projects, but you may find them useful elsewhere.

## Usage

If you're using or extending `@primer/stylelint-config` already, then you're using all of these plugins by default. See [`index.js`](../index.js) for the config defaults.

If you're _not_ using or extending `@primer/stylelint-config`, you can still reference the plugins by referencing their module paths like so:

```js
// stylelint.config.js
module.exports = {
  plugins: ['@primer/stylelint-config/plugins/no-override', '@primer/stylelint-config/plugins/no-unused-vars']
}
```

## `primer/no-override`

This rule prohibits "overriding" class selectors defined in [Primer CSS]. By default, it will only fail selectors that target utility classes:

```scss
// FAIL
.mt-0 {
  /* literally anything */
}
```

You can further constrain overrides to exclude _any_ class selector in Primer by providing additional names in the `bundles` option:

```js
// stylelint.config.js
module.exports = {
  // ...
  rules: {
    'primer/no-override': [
      true,
      {
        bundles: ['utilities', core', 'product', 'marketing']
      }
    ]
  }
}
```

## `primer/no-unused-vars`

This rule helps you find SCSS variables that _may_ not be used, and can be safely deleted. It works by scanning all of the SCSS files in your project and looking for anything that appears to be either a Sass variable declaration or reference:

```scss
    $name: value;
/**      ↑
 *  The colon is what makes this a declaration */

/* Anything starting with a $ and followed by word chars or hyphens
 * and _not_ followed by a colon is considered a reference: */

    margin: $value;
/**               ↑
 *                Not a colon */
    padding: $value 1px;
/**                ↑
 *                 Not a colon */

@media screen and (max-width: $break-lg) {
/**                                    ↑
 *                                     Also not a colon */
```

Equipped with a list of all the variable declarations and references, the linting rule walks all of the declarations in the
file being linted, finds any that look like declarations (using the same pattern as the project-wide scan), and generates a warning for any that have zero references in the files it's scanned.

Because there isn't any good way for a stylelint plugin to know all of the files being linted, it needs to be told where to find all of the declarations and references in its options:

- `files` is a single path, glob, or array of paths and globs, that tells the plugin which files to scan relative to the current working directory. The default is `['**/*.scss', '!node_modules']`, which tells [globby] to find all the `.scss` files recursively and ignore the `node_modules` directory.

- `variablePattern` is a regular expression that matches a single variable in either a source file string or the `prop` of a postcss Declaration node (`{type: 'decl'}`). The default matches Sass/SCSS variables: `/\$[-\w]/g`. Note that the `g` ("global") flag is _required_ to match multiple variable references on a single line.

- `verbose` is a boolean that enables chatty `console.warn()` messages telling you what the plugin found, which can aid in debugging more complicated project layouts.

## `primer/no-deprecated-colors`

This rule identifies deprecated color variables from [primer/primitives]](https://github.com/primer/primitives) deprecated.json file and suggests replacements.

```scss
body {
  color: var(--color-fg-default);
}
/**          ↑
 *           OK: --color-text-primary is defined */

body {
  color: var(--color-text-primary);
}
/**          ↑
 *           FAIL: --color-text-primary is deprecated. */
```

## `primer/no-undefined-vars`

This rule prohibits any usages of undefined CSS variables.

```scss
:root {
  --color-text-primary: #000;
}

body {
  color: var(--color-text-primary);
}
/**          ↑
 *           OK: --color-text-primary is defined */

body {
  color: var(--color-foo);
}
/**          ↑
 *           FAIL: --color-foo is not defined */
```

For the purposes of this rule, a CSS variable declaration is any text starting with `--` and immediately followed by a colon.

Because there isn't a good way for a stylelint plugin to know what CSS variables are defined, it needs to be told where to look for declarations in its options:

- `files` is a single path, glob, or array of paths and globs, that tells the plugin which files (relative to the current working directory) to scan for CSS variable declarations. The default is `['**/*.scss', '!node_modules']`, which tells [globby] to find all the `.scss` files recursively and ignore the `node_modules` directory.
- `verbose` is a boolean that enables chatty `console.warn()` messages telling you what the plugin found, which can aid in debugging more complicated project layouts.

## `primer/no-scale-colors`

This rule prohibits the use of [non-functional scale CSS variables](https://primer.style/css/support/color-system#color-palette) like `var(--color-scale-blue-1)` in all cases except the `color-variables` mixin.

```scss
// Okay; using scale colors while defining new variables
@include color-scale-var('new-var-name', var(--color-scale-blue-1), var(--color-scale-blue-2))

// Fail; using scale colors directly as a property value
.selector {
  color: var(--color-scale-blue-1)
}
```

## `primer/colors`

This [variable rule](#variable-rules) enforces the use of Primer [color system](https://primer.style/css/support/color-system) variables for `color` and `background-color` CSS properties. Generally speaking, variables matching the pattern `$text-*` are acceptable for `color` (and `fill`), and `$bg-*` are acceptable for `background-color`. See [the configuration](./colors.js) for more info.

```scss
body {
  color: black;
}
/**           ↑
 *            FAIL: Use a variable. */

body {
  color: $gray-900;
}
/**           ↑
 *            FAIL: Use $text-gray-dark instead. */
```

## `primer/spacing`

This [variable rule](#variable-rules) enforces the use of Primer [spacing variables](https://primer.style/css/support/spacing) in margin and padding CSS properties. See [the configuration](./spacing.js) for more info.

```scss
ul {
  margin: 0 0 $spacer-3;
}
/**          ↑
 *           OK: "0" and "$spacer-*" are allowed values */

ul {
  margin: 0 0 16px;
}
/**              ↑
 *               FAIL: Use "$spacer-3" (auto-fixable!) */
```

## `primer/typography`

This [variable rule](#variable-rules) enforces the use of [typography variables](https://primer.style/css/support/typography#typography-variables) for `font-size`, `font-weight`, and `line-height` CSS properties. See [the configuration](./typography.js) for more info.

## `primer/borders`

This [variable rule](#variable-rules) enforces the use of border-specific variables (`$border-width`, `$border-style`, and `$border-color*`, and the `$border` shorthand) for all border CSS properties (including the `border` shorthand). The values `0` and `none` are also allowed; see [the configuration](./borders.js) for more info.

## `primer/box-shadow`

This [variable rule](#variable-rules) enforces the use of `$box-shadow*` variables for the `box-shadow` CSS property. See [the configuration](./box-shadow.js) for more info.

## `primer/responsive-widths`

This plugin checks for `width` and `min-width` declarations that use a value less than the minimum browser size. `320px`

## `primer/utilities`

Checks for selectors with single declarations that can be replaced with [primer/css utilities](https://primer.style/css/utilities/).

```scss
.foo {
  color: var(--color-fg-default);
}
/**          ↑
 *           FAIL: --color-fg-default can be replaced with .color-fg-default */

.foo {
  color: #custom;
}
/**          ↑
 *           OK: Color value doesn't match a utility. */

.foo {
  color: var(--color-fg-default);
  padding: 0;
}
/**          ↑
 *           OK: Has more than one declaration, not considered */
```

## Variable rules

Variable rules are created using a general-purpose helper that can validate constraints for matching CSS properties and values. In general, the Primer CSS variable rules enforce two basic principles for custom CSS:

- Use Primer variables whenever possible.
- Use _functional_ variables (`$text-gray` vs. `$gray-700`) whenever possible.

Validations take the form of an object literal in which each key/value pair defines a set of named constraints that apply to one or more CSS properties:

```js
{
  'background color': {
    props: 'background-color',
    // ...
  },
  'foreground color': {
    props: ['color', 'fill'],
    // ...
  }
}
```

The objects in each named rule may have the following keys:

- `props` is an array or string of [glob patterns] that match CSS properties. For individual properties like `color`, a string without any special glob characters works just fine. You can use brace expansion to match directional properties:

  ```js
  'border width': {
    props: 'border{,-top,-right,-bottom,-left}-width',
    // which expands to:
    props: [
      'border-width',
      'border-top-width',
      'border-right-width',
      'border-bottom-width',
      'border-left-width'
    ]
  }
  ```

  **Note:** if no `props` are listed, the name of the rule is assumed to be the CSS property.

- `values` is, similar to `props`, an array or string of [glob patterns] that match _individual CSS values_ in a single property. Property values are parsed with [postcss-value-parser](https://www.npmjs.com/package/postcss-value-parser), so they respect parentheses, functions, and values within them. If a property has more than one value (e.g. `margin: 0 auto`), each one is compared against the `values` list to determine its validity, and a warning is generated for each invalid value.

  For example, if we fleshed out the `border width` rule defined above with `values`:

  ```js
  'border width': {
    props: 'border{,-top,-right,-bottom,-left}-width',
    values: ['$border-*', '0']
  }
  ```

  Then the following SCSS checks out:

  ```scss
  .Box {
    border-width: 0 0 $border-width;
    /**             ↑ ↑ ↑
   *              ↑ ↑ OK!
   *              ↑ OK!
   *              OK!                */
  }
  ```

- `components` tells the rule that multiple values resolve to a list of ordered properties with their own, separately defined rules. This makes it possible for shorthand CSS properties like `border`, `background`, or `font` to "delegate" validation to a rule with more specific constraints. For example, you could enforce different types of border variables for most of the CSS border properties with:

  ```js
  'border': {
    props: 'border{,-top,-right,-bottom,-left}',
    components: ['border-width', 'border-style', 'border-color']
  },
  'border width': {
    props: 'border{,-top,-right,-bottom,-left}-width',
    values: ['$border-width', '0']
  },
  'border style': {
    props: 'border{,-top,-right,-bottom,-left}-style',
    values: ['$border-style', 'none']
  },
  'border color': {
    props: 'border{,-top,-right,-bottom,-left}-color',
    values: ['$border-*', 'transparent']
  }
  ```

- `replacements` is an object listing property values that can safely be replaced via `stylelint --fix` with other variable or static values, as in the Primer CSS `font-size` rule:

  ```js
  'font-size': {
    props: 'font-size',
    values: ['$h{0,1,2,3,4,5,6}-size', '$font-size-small'],
    replacements: {
      '40px': '$h0-size',
      '32px': '$h1-size',
      '24px': '$h2-size',
      '20px': '$h3-size',
      '16px': '$h4-size',
      '14px': '$h5-size',
      '12px': '$h6-size'
    }
  }
  ```

### Variable rule options

All variable rules respect the following rule options, as in:

```js
// stylelint.config.js
module.exports = {
  extends: '@primer/stylelint-config',
  rules: {
    'primer/colors': [true /* options here */]
    /*                ↑
     *                false disables the rule */
  }
}
```

- `rules` extends the validations for the rule, and can be used to disable specific validations, as e.g.

  ```js
  rules: {
    'primer/colors': [true, {
      rules: {
        'background color': false, // disabled
        'text color': {
          // override the text color validation rules here
        }
    }]
  }
  ```

- `verbose` is a boolean that enables chatty `console.warn()` messages that may help you debug more complicated configurations.

- `disableFix` is a boolean that can disable auto-fixing of this rule when running `stylelint --fix` to auto-fix other rules.

[primer css]: https://primer.style/css
[globby]: https://www.npmjs.com/package/globby
[glob patterns]: http://tldp.org/LDP/GNU-Linux-Tools-Summary/html/x11655.htm
