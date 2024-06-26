# Primer Stylelint Config

[![npm version](https://img.shields.io/npm/v/@primer/stylelint-config.svg)](https://www.npmjs.org/package/@primer/stylelint-config)

> A sharable stylelint config object that enforces GitHub's CSS rules

## Install

```
$ npm install --save --dev @primer/stylelint-config
```

## Usage

Within your [stylelint config object](http://stylelint.io/user-guide/configuration/#extends) You can extend this configuration. This will serve as a base for your config, then you can make overrides in your own config object:

```json
{
  "extends": ["@primer/stylelint-config"],
  "rules": { }
}
```

## Documentation

Primer Stylelint Config extends the [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) configuration supplied by Stylelint, and makes modifications in `/index.js`.

### Plugins

- [stylelint-order](https://github.com/hudochenkov/stylelint-order): Order-related linting rules for stylelint. Properties must be [sorted according to this list](https://github.com/primer/stylelint-config/blob/main/property-order.js).
- [stylelint-scss](https://github.com/kristerkari/stylelint-scss): A collection of SCSS specific linting rules for stylelint
  - [scss/selector-no-redundant-nesting-selector](https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/selector-no-redundant-nesting-selector/README.md): Disallow redundant nesting selectors (`&`).
- [primer/colors](./plugins/#primercolors): Enforces the use of certain color variables.
- [primer/spacing](./plugins/#primerspacing): Enforces the use of spacing variables for margin and padding.
- [primer/typography](./plugins/#primertypography): Enforces the use of typography variables for certain CSS properties.
- [primer/borders](./plugins/#primerborders): Enforces the use of certain variables for border properties.
- [primer/box-shadow](./plugins/#primerbox-shadow): Enforces the use of certain variables for `box-shadow`.
- [primer/responsive-widths](./plugins/#primerresponsive-widths): Errors on `width` and `min-width` that is larger than the minimum browser size supported. `320px`

## License

[MIT](./LICENSE) &copy; [GitHub](https://github.com/)
