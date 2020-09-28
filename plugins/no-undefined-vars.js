const stylelint = require('stylelint')

const ruleName = 'primer/no-undefined-vars'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: 'Oops'
})

module.exports = stylelint.createPlugin(ruleName, enabled => {
  if (!enabled) {
    return noop
  }

  return (root, result) => {
    stylelint.utils.report({
      message: messages.rejected,
      node: root,
      result,
      ruleName
    })
  }
})

function noop() {}
