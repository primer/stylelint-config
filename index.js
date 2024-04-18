import browsers from '@github/browserslist-config'
import propertyOrder from './property-order.js'

import borders from './plugins/borders.js'
import boxShadow from './plugins/box-shadow.js'
import colors from './plugins/colors.js'
import noScaleColors from './plugins/no-scale-colors.js'
import noUndefinedVars from './plugins/no-undefined-vars.js'
import noUnusedVars from './plugins/no-unused-vars.js'
import responsiveWidths from './plugins/responsive-widths.js'
import spacing from './plugins/spacing.js'
import typography from './plugins/typography.js'
import utilities from './plugins/utilities.js'
import noDisplayColors from './plugins/no-display-colors.js'

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['**/*.js', '**/*.cjs'],
  reportNeedlessDisables: true,
  plugins: [
    'stylelint-no-unsupported-browser-features',
    'stylelint-order',
    borders,
    boxShadow,
    colors,
    noScaleColors,
    noUndefinedVars,
    noUnusedVars,
    responsiveWidths,
    spacing,
    typography,
    utilities,
    noDisplayColors,
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
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignore: ['css-nesting'],
        ignorePartialSupport: true,
        browsers,
      },
    ],
    'primer/borders': true,
    'primer/box-shadow': true,
    'primer/colors': true,
    'primer/no-undefined-vars': [
      true,
      {severity: 'warning', files: 'node_modules/@primer/primitives/dist/scss/colors*/*.scss'},
    ],
    'primer/no-unused-vars': [true, {severity: 'warning'}],
    'primer/responsive-widths': true,
    'primer/spacing': true,
    'primer/typography': true,
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
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
      plugins: ['stylelint-scss'],
      rules: {
        'scss/at-extend-no-missing-placeholder': true,
        'scss/at-rule-no-unknown': true,
        'scss/declaration-nested-properties-no-divided-groups': true,
        'scss/dollar-variable-no-missing-interpolation': true,
        'scss/function-quote-no-quoted-strings-inside': true,
        'scss/function-unquote-no-unquoted-strings-inside': true,
        'scss/no-duplicate-mixins': true,
        'scss/selector-no-redundant-nesting-selector': true,
      },
    },
    {
      files: ['**/*.tsx'],
      customSyntax: 'postcss-styled-syntax',
      rules: {
        'order/properties-order': null,
        'rule-empty-line-before': null,
        'declaration-empty-line-before': null,
        'comment-empty-line-before': null,
        'length-zero-no-unit': null,
        'selector-max-type': null,
        'primer/spacing': null,
        'primer/colors': null,
        'primer/borders': null,
        'primer/typography': null,
        'primer/box-shadow': null,
        'primer/no-scale-colors': true,
        'primer/no-display-colors': true,
        'primer/utilities': null,
        'property-no-unknown': [
          true,
          {
            ignoreProperties: ['@container', 'container-type'],
          },
        ],
      },
    },
    {
      files: ['**/*.pcss'],
      rules: {
        'media-feature-range-notation': null,
        'import-notation': null,
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
      },
    },
    {
      files: ['**/*.module.css'],
      rules: {},
    },
  ],
}
