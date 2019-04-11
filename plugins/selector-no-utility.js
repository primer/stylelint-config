const stylelint = require('stylelint')

const ruleName = 'primer/selector-no-utility'
let rule = () => null
let selectorNoUtility
try {
  selectorNoUtility = require('stylelint-selector-no-utility')
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn(`Unable to require('stylelint-selector-no-utility'): ${error}`)
}

rule = selectorNoUtility.rule

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
