const stylelint = require('stylelint')
const {rule, ruleName} = require('stylelint-selector-no-utility')

module.exports = stylelint.createPlugin(ruleName, (enabled, ...args) => {
  const deprecatedPlugin = rule(enabled, ...args)
  return (root, result) => {
    if (enabled === false) {
      return
    }
    result.warn(
      `'${ruleName}' has been deprecated and will be removed in stylelint-config-primer@7.0.0. Please update your rules to use 'primer/no-override'.`,
      {
        stylelintType: 'deprecation',
        stylelintReference: 'https://github.com/primer/stylelint-config-primer#deprecations'
      }
    )
    return deprecatedPlugin(root, result)
  }
})
