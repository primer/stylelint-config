# Primer stylelint plugins
This directory contains all of our custom stylelint plugins, each
of which provides a single stylelint rule.

### Rules
- [`primer/no-override`](#primerno-override)
- [`primer/no-unused-vars`](#primerno-unused-vars)
- [`primer/variables`](#primervariables)

These were intended for use with [Primer CSS] and GitHub
projects, but you may find them useful elsewhere.

## Usage
If you're using or extending `stylelint-config-primer` already,
then you're using all of these plugins by default. See
[`index.js`](../index.js) for the config defaults.

If you're _not_ using or extending `stylelint-config-primer`, you
can still reference the plugins by referencing their module paths
like so:

```js
// stylelint.config.js
module.exports = {
  plugins: [
    'stylelint-config-primer/plugins/no-override',
    'stylelint-config-primer/plugins/no-unused-vars'
  ]
}
```

## `primer/no-override`
This rule prohibits "overriding" class selectors defined in
[Primer CSS]. By default, it will only fail selectors that target
utility classes:

```scss
// FAIL
.mt-0 { /* literally anything */ }
```

You can further constrain overrides to exclude _any_ class
selector in Primer by providing additional names in the `bundles`
option:

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
This rule helps you find SCSS variables that _may_ not be used,
and can be safely deleted. It works by scanning all of the SCSS
files in your project and looking for anything that appears to be
either a Sass variable declaration or reference:

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

Armed with a list of all the variable declarations and
references, the linting rule walks all of the declarations in the
file being linted, finds any that look like declarations (using
the same pattern as the project-wide scan), and generates a
warning for any that have zero references in the files it's
scanned.

Because there isn't any good way for a stylelint plugin to know
all of the files being linted, it needs to be told where to find
all of the declarations and references in its options:

- `files` a single path, glob, or array of paths and globs, that
  tells the plugin which files to scan relative to the current
  working directory. The default is `['**/*.scss',
  '!node_modules']`, which tells [globby] to find all the `.scss`
  files recursively and ignore the `node_modules` directory.

- `variablePattern` is a regular expression that matches a single
  variable in either a source file string or the `prop` of a
  postcss `decl` node. The default matches Sass/SCSS variables:
  `/\$[-\w]/g`. Note that the `g` ("global") flag is _required_
  to match multiple variable references on a single line.

- `verbose` is a boolean that enables chatty `console.warn()`
  messages telling you what the plugin found, which can aid in
  debugging more complicated project layouts.

## `primer/variables`
This rule is a general-purpose linter for constraining values
allowed in specific CSS properties, but comes with a default
[rule set](#primer-variable-rules) tailored for big projects
built on [Primer CSS]. Some examples:

```scss
body { color: black; }
/**           ↑
 *            FAIL: Use a variable. */

body { color: $gray-900; }
/**           ↑
 *            FAIL: Use $text-gray-dark instead. */

ul { margin: 0 0 $spacer-3; }
/**          ↑
 *           OK: "0" and "$spacer-*" are allowed values */

ul { margin: 0 0 16px; }
/**              ↑
 *               FAIL: Use "$spacer-3" (auto-fixable!) */
}
```

### Options
- `rules` is an optional object providing one or more [variable
  rules](#variable-rules) by name. Individual [Primer
  rules](#primer-variable-rules) can be overridden or disabled:

  ```js
  rules: {
    'primer/variables': [true, {
      rules: {
        // disable background-color checks
        'background color': false,
        // override text color (color) checks
        'text color': {
          props: ['fill', 'color'],
          values: ['$text-*', '$fill-*', 'transparent', 'currentColor']
        }
      }
    }]
  }
  ```

- `verbose` is a boolean that enables chatty `console.warn()`
  messages that can help you debug complicated variable rules.

- `disableFix` is a boolean that can disable auto-fixing of this
  rule when running `stylelint --fix` to auto-fix other rules.

### Variable rules
Each key/value pair in the `rules` option object defines a set of
named constraints that apply to one or more CSS properties, and
can provide auto-fix replacements for known exact matches. Each
key of the `rules` object is the human-readable name of the rule.
The value is another object with one or more of the following
properties:

- `props` is an array or string of [glob patterns] that match CSS
  properties. For individual properties like `color`, a string
  without any special glob characters is great. To match
  directional properties, though, use the following pattern:

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

- `values` is, similar to `props`, an array or string of [glob
  patterns] that match _individual CSS values_ in a single
  property. Property values are split on whitespace (respecing
  parentheses, functions and arguments); if a property has more
  than one value, each one is compared against the `values` list
  to determine its validity. (The `!important` identifier is
  _always_ valid.)

  For example, if we fleshed out the `border width` rule defined
  above with `values`:

  ```js
  'border width': {
    props: 'border{,-top,-right,-bottom,-left}-width',
    values: ['$border-*', '0']
  }
  ```

  Then the following CSS checks out:

  ```scss
  .Box {
    border-width: 0 0 $border-width;
  /**             ↑ ↑ ↑
   *              ↑ ↑ OK!
   *              ↑ OK!
   *              OK!                */
  }
  ```

- `components` tells the rule that all of the properties matching
  `props` resolve to a list of ordered properties with their
  _own_, separately defined rules. This makes it possible for
  compound CSS properties like `border`, `background`, or `font`
  to "delegate" validation of each component of their value to
  a rule with more specific constraints. For example, you could
  succinctly enforce different types of border variables for most
  of the CSS border properties with:

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

- `replacements` is an object listing property values that can
  safely be replaced via `stylelint --fix` with other variable or
  static values, as in the Primer CSS `font-size` rule:

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

### Primer variable rules
In general, the Primer CSS variable rules enforce two basic
principles for custom CSS:

- Use Primer variables whenever possible.
- Use _functional_ variables (`$text-gray` vs. `$gray-700`)
  whenever possible.

See [`plugins/lib/variable-rules.js`](./lib/variable-rules.js)
for the full set of rules.

[primer css]: https://primer.style/css
[globby]: https://www.npmjs.com/package/globby
[glob patterns]: http://tldp.org/LDP/GNU-Linux-Tools-Summary/html/x11655.htm
