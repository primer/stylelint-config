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
    './plugins/borders',
    './plugins/box-shadow',
    './plugins/colors',
    './plugins/no-deprecated-colors',
    './plugins/no-experimental-vars',
    './plugins/no-override',
    './plugins/no-scale-colors',
    './plugins/no-undefined-vars',
    './plugins/no-unused-vars',
    './plugins/responsive-widths',
    './plugins/spacing',
    './plugins/typography',
    './plugins/utilities',
    './plugins/new-color-vars-have-fallback',
    './plugins/no-display-colors',
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
    'declaration-property-value-disallowed-list': {
      '/^transition/': ['/all/'],
      '/^background/': ['http:', 'https:'],
      '/^border/': ['none'],
      '/.+/': ['initial'],
    },
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'function-no-unknown': null,
    'keyframes-name-pattern': null,
    'max-nesting-depth': 3,
    'media-feature-name-no-unknown': null,
    'media-feature-name-no-vendor-prefix': null,
    'no-descending-specificity': null,
    'no-duplicate-selectors': true,
    'no-invalid-position-at-import-rule': [true, {ignoreAtRules: ['use']}],
    'number-max-precision': null,
    'order/properties-order': propertyOrder,
    'plugin/no-unsupported-browser-features': [true, {severity: 'warning', browsers}],
    'primer/borders': true,
    'primer/box-shadow': true,
    'primer/colors': true,
    'primer/no-deprecated-colors': true,
    'primer/no-experimental-vars': [
      true,
      {
        designTokens: '@primer/primitives/tokens-v2-private/docs/docValues.json',
      },
    ],
    'primer/no-override': true,
    'primer/no-undefined-vars': [
      true,
      {severity: 'warning', files: 'node_modules/@primer/primitives/dist/scss/colors*/*.scss'},
    ],
    'primer/no-unused-vars': [true, {severity: 'warning'}],
    'primer/responsive-widths': true,
    'primer/spacing': true,
    'primer/typography': true,
    'primer/utilities': null,
    'primer/new-color-vars-have-fallback': [true, {severity: 'error'}],
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
    'unit-no-unknown': true,
    'value-keyword-case': null,
    'selector-not-notation': null,
    'import-notation': ['string'],
    'annotation-no-unknown': null,
    'keyframe-selector-notation': ['percentage-unless-within-keyword-only-block'],
    'media-query-no-invalid': null,
    'media-feature-range-notation': ['prefix'],
  },
}
