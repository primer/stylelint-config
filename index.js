const browsers = require('./browsers')
const propertyOrder = require('./property-order')

module.exports = {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['**/*.js', '**/*.cjs'],
  plugins: [
    'stylelint-no-unsupported-browser-features',
    'stylelint-order',
    './plugins/box-shadow',
    './plugins/colors',
    './plugins/no-deprecated-colors',
    './plugins/no-experimental-vars',
    './plugins/no-override',
    './plugins/no-scale-colors',
    './plugins/no-undefined-vars',
    './plugins/no-unused-vars',
    './plugins/responsive-widths',
    './plugins/utilities',
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
    'primer/utilities': null,
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
  overrides: [
    {
      files: ['*.scss', '**/*.scss'],
      customSyntax: require('postcss-scss'),
      plugins: ['stylelint-scss', './plugins/borders', './plugins/typography', './plugins/spacing'],
      rules: {
        'scss/at-extend-no-missing-placeholder': true,
        'scss/at-rule-no-unknown': true,
        'scss/declaration-nested-properties-no-divided-groups': true,
        'scss/dollar-variable-no-missing-interpolation': true,
        'scss/function-quote-no-quoted-strings-inside': true,
        'scss/function-unquote-no-unquoted-strings-inside': true,
        'scss/no-duplicate-mixins': true,
        'scss/selector-no-redundant-nesting-selector': true,
        'primer/borders': true,
        'primer/spacing': true,
        'primer/typography': true
      },
    },
    {
      files: ['*.tsx', '**/*.tsx'],
      rules: {
        'order/properties-order': null,
        'rule-empty-line-before': null,
        'declaration-empty-line-before': null,
        'comment-empty-line-before': null,
        'length-zero-no-unit': null,
        'scss/selector-no-redundant-nesting-selector': null,
        'selector-max-type': null,
        'primer/spacing': null,
        'primer/colors': null,
        'primer/borders': null,
        'primer/typography': null,
        'primer/box-shadow': null,
        'primer/no-deprecated-colors': [
          true,
          {
            inlineFallback: true,
          },
        ],
        'primer/no-scale-colors': null,
        'primer/utilities': null,
        'property-no-unknown': [
          true,
          {
            ignoreProperties: ['@container', 'container-type'],
          },
        ],
        'scss/at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: ['container', 'container-type'],
          },
        ],
        'primer/no-override': null,
      },
    },
    {
      files: ['*.pcss', '**/*.pcss'],
      rules: {
        'custom-property-pattern': null,
        'selector-class-pattern': null,
        'keyframes-name-pattern': null,
        'no-descending-specificity': null,
        'declaration-block-no-redundant-longhand-properties': null,
        'color-function-notation': 'legacy',
        'selector-nested-pattern': '^&\\s?\\W',
        'at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: ['mixin', 'define-mixin'],
          },
        ],
        'primer/no-deprecated-colors': true,
      },
    },
  ],
}
