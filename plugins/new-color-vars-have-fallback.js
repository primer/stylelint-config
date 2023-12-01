const stylelint = require('stylelint')

const ruleName = 'primer/new-color-vars-have-fallback'
const messages = stylelint.utils.ruleMessages(ruleName, {
  expectedFallback: variable =>
    `Expected a fallback value for CSS variable ${variable}. New color variables fallbacks, check primer.style/primitives to find the correct value`,
})

module.exports = stylelint.createPlugin(ruleName, enabled => {
  const variables = require('./lib/new-color-css-vars-map.json')

  if (!enabled) {
    return noop
  }

  return (root, result) => {
    root.walkDecls(node => {
      for (const variable of variables) {
        if (node.value.includes(`var(${variable})`)) {
          // Check if the declaration uses a CSS variable from the JSON
          const match = node.value.match(new RegExp(`var\\(${variable},(.*)\\)`))
          if (!match || match[1].trim() === '') {
            stylelint.utils.report({
              ruleName,
              result,
              node,
              message: messages.expectedFallback(variable),
            })
          }
        }
      }
    })
  }
})

function noop() {}

module.exports.ruleName = ruleName
module.exports.messages = messages
