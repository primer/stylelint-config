const stylelint = require('stylelint')
const {rule, ruleName} = require('stylelint-selector-no-utility')

module.exports = stylelint.createPlugin(ruleName, (actual, ...args) => {
  const deprecatedPlugin = rule(actual, ...args)
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {actual})
    if (!validOptions) {
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
