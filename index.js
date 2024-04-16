import browsers from '@github/browserslist-config'
import propertyOrder from './property-order.js'
import scssSyntax from 'postcss-scss'

import borders from './plugins/borders.js'
import boxShadow from './plugins/box-shadow.js'
import colors from './plugins/colors.js'
import noDeprecatedColors from './plugins/no-deprecated-colors.js'
import noOverride from './plugins/no-override.js'
import noScaleColors from './plugins/no-scale-colors.js'
import noUndefinedVars from './plugins/no-undefined-vars.js'
import noUnusedVars from './plugins/no-unused-vars.js'
import responsiveWidths from './plugins/responsive-widths.js'
import spacing from './plugins/spacing.js'
import typography from './plugins/typography.js'
import utilities from './plugins/utilities.js'
import newColorVarsHaveFallback from './plugins/new-color-vars-have-fallback.js'
import noDisplayColors from './plugins/no-display-colors.js'

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  customSyntax: scssSyntax,
  ignoreFiles: ['**/*.js', '**/*.cjs'],
  plugins: [
    'stylelint-no-unsupported-browser-features',
    'stylelint-order',
    'stylelint-scss',
    borders,
    boxShadow,
    colors,
    noDeprecatedColors,
    noOverride,
    noScaleColors,
    noUndefinedVars,
    noUnusedVars,
    responsiveWidths,
    spacing,
    typography,
    utilities,
    newColorVarsHaveFallback,
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
    'plugin/no-unsupported-browser-features': [true, {severity: 'warning', browsers}],
    'primer/borders': true,
    'primer/box-shadow': true,
    'primer/colors': true,
    'primer/no-deprecated-colors': true,
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
