# Primer stylelint plugins
This directory contains all of our custom stylelint plugins. These were
intended for use with [Primer CSS] and GitHub projects, but you may find them
useful elsewhere.

## Usage
If you're using or extending `stylelint-config-primer` already, then you're
using all of these plugins by default. See [`index.js`](../index.js) for the
config defaults.

If you're _not_ using or extending `stylelint-config-primer`, you can still
reference the plugins by referencing their module paths like so:

```js
// stylelint.config.js
module.exports = {
  plugins: [
    'stylelint-config-primer/plugins/no-override',
    'stylelint-config-primer/plugins/no-unused-vars'
  ]
}
```

## Plugins

### `primer/no-override`
This plugin helps prohibits "overriding" class selectors defined in [Primer
CSS]. By default, it will only fail selectors that target utility classes:

```scss
// FAIL
.mt-0 { /* literally anything */ }
```

You can further constrain overrides to exclude _any_ class selector in Primer
by providing additional names in the `bundles` option:

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

### `primer/no-unused-vars`
This plugin helps you find SCSS variables that _may_ not be used, and can be
safely deleted. It works by scanning all of the SCSS files in your project and
looking for anything that appears to be either a Sass variable declaration or
reference:

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

Armed with a list of all the variable declarations and references, the linting
rule walks all of the declarations in the file being linted, finds any that
look like declarations (using the same pattern as the project-wide scan), and
generates a warning for any that have zero references in the files it's
scanned.

Because there isn't any good way for a stylelint plugin to know all of the
files being linted, it needs to be told where to find all of the declarations
and references in its options:

* `files` a single path, glob, or array of paths and globs, that tells the
  plugin which files to scan relative to the current working directory. The
  default is `['**/*.scss', '!node_modules']`, which tells [globby] to find all
  the `.scss` files recursively and ignore the `node_modules` directory.

* `variablePattern` is a regular expression that matches a single variable in
  either a source file string or the `prop` of a postcss `decl` node. The
  default matches Sass/SCSS variables: `/\$[-\w]/g`. Note that the `g`
  ("global") flag is _required_ to match multiple variable references on a
  single line.

* `verbose` is a boolean that enables chatty `console.warn()` messages telling
  you what the plugin found, which can aid in debugging more complicated
  project layouts.

[primer css]: https://primer.style/css
