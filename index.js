const browsers = require('./browsers')
const propertyOrder = require('./property-order')

module.exports = {
  extends: ['stylelint-config-standard'],
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
    './plugins/spacing',
    './plugins/typography'
  ],
  rules: {
    'at-rule-disallowed-list': ['extend'],
    'block-no-empty': true,
    'color-named': 'never',
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates']
      }
    ],
    'declaration-block-no-shorthand-property-overrides': true,
    'order/properties-order': propertyOrder,
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-property-value-disallowed-list': {
      '/^transition/': ['/all/'],
      '/^background/': ['http:', 'https:'],
      '/^border/': ['none'],
      '/.+/': ['initial']
    },
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'max-nesting-depth': 3,
    'no-duplicate-selectors': true,
    'no-extra-semicolons': true,
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        browsers
      }
    ],
    'primer/no-override': true,
    'primer/no-deprecated-colors': true,
    // unused vars are not necessarily an error, since they may be referenced
    // in other projects
    'primer/no-unused-vars': [true, {severity: 'warning'}],
    'scss/selector-no-redundant-nesting-selector': true,
    'selector-max-compound-selectors': 3,
    'selector-max-id': 0,
    'selector-max-specificity': '0,4,0',
    'selector-max-type': 0,
    'selector-no-qualifying-type': true,
    'selector-pseudo-element-no-unknown': true,
    'string-no-newline': true,
    'string-quotes': 'single',
    'unit-no-unknown': true
  }
}
