const browsers = require('./browsers')
const propertyOrder = require('./property-order')

module.exports = {
  extends: ['stylelint-config-standard'],
  customSyntax: require('postcss-scss'),
  ignoreFiles: ['**/*.js', '**/*.cjs'],
  plugins: [
    'stylelint-no-unsupported-browser-features',
    'stylelint-order',
    'stylelint-scss',
    './plugins/no-override',
    './plugins/no-deprecated-colors',
    './plugins/no-unused-vars',
    './plugins/no-undefined-vars',
    './plugins/no-scale-colors',
    './plugins/borders',
    './plugins/box-shadow',
    './plugins/colors',
    './plugins/responsive-widths',
    './plugins/spacing',
    './plugins/typography'
  ],
  rules: {
    'alpha-value-notation': 'number',
    'at-rule-disallowed-list': ['extend'],
    'at-rule-no-unknown': null,
    'block-no-empty': true,
    'color-function-notation': null,
    'color-named': 'never',
    'color-no-invalid-hex': true,
    'comment-no-empty': null,
    'custom-property-pattern': null,
    'declaration-block-no-duplicate-properties': [true, {ignore: ['consecutive-duplicates']}],
    'declaration-block-no-redundant-longhand-properties': null,
    'declaration-block-no-shorthand-property-overrides': true,
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-property-value-disallowed-list': {
      '/^transition/': ['/all/'],
      '/^background/': ['http:', 'https:'],
      '/^border/': ['none'],
      '/.+/': ['initial']
    },
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'function-no-unknown': null,
    'keyframes-name-pattern': null,
    'max-line-length': null,
    'max-nesting-depth': 3,
    'media-feature-name-no-unknown': null,
    'media-feature-name-no-vendor-prefix': null,
    'no-descending-specificity': null,
    'no-duplicate-selectors': true,
    'no-extra-semicolons': true,
    'no-invalid-position-at-import-rule': [true, {ignoreAtRules: ['use']}],
    'number-max-precision': null,
    'order/properties-order': propertyOrder,
    'plugin/no-unsupported-browser-features': [true, {severity: 'warning', browsers}],
    'primer/borders': true,
    'primer/box-shadow': true,
    'primer/colors': true,
    'primer/no-deprecated-colors': true,
    'primer/no-override': true,
    'primer/no-undefined-vars': [
      true,
      {severity: 'warning', files: 'node_modules/@primer/primitives/dist/scss/colors*/*.scss'}
    ],
    'primer/no-unused-vars': [true, {severity: 'warning'}],
    'primer/responsive-widths': true,
    'primer/spacing': true,
    'primer/typography': true,
    'scss/at-extend-no-missing-placeholder': true,
    'scss/at-rule-no-unknown': true,
    'scss/declaration-nested-properties-no-divided-groups': true,
    'scss/dollar-variable-no-missing-interpolation': true,
    'scss/function-quote-no-quoted-strings-inside': true,
    'scss/function-unquote-no-unquoted-strings-inside': true,
    'scss/no-duplicate-mixins': true,
    'scss/selector-no-redundant-nesting-selector': true,
    'selector-class-pattern': null,
    'selector-max-compound-selectors': 3,
    'selector-max-id': 0,
    'selector-max-specificity': '0,4,0',
    'selector-max-type': 0,
    'selector-no-qualifying-type': true,
    'selector-pseudo-element-no-unknown': true,
    'string-no-newline': true,
    'string-quotes': 'single',
    'unit-no-unknown': true,
    'value-keyword-case': null
  }
}
