const stylelint = require('stylelint')
const utilities = require('./lib/primer-utilities')

const ruleName = 'primer/utilities'

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (selector, utilityClass) => {
    return `Consider using the Primer utility '.${utilityClass}' instead of the selector '${selector}' in your html. https://primer.style/css/utilities`
  },
})

// eslint-disable-next-line no-unused-vars
module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}, context) => {
  if (!enabled) {
    return noop
  }

  const utilityReplacement = (declaration, value) => {
    const declarationUtilities = utilities[declaration]
    if (declarationUtilities) {
      return declarationUtilities.find(utility => {
        return utility.value === value
      })
    }
  }

  const lintResult = (root, result) => {
    root.walkRules(rule => {
      if (!/^\.[\w\-_]+$/.exec(rule.selector)) {
        return
      }
      const decls = rule.nodes.filter(decl => decl.type === 'decl')

      if (decls.length === 1) {
        const replacement = utilityReplacement(decls[0].prop, decls[0].value)
        if (replacement) {
          stylelint.utils.report({
            index: rule.sourceIndex,
            message: messages.rejected(rule.selector, replacement.utilityClass),
            node: rule,
            result,
            ruleName,
          })
        }
      }
    })
  }

  return lintResult
})

function noop() {}

module.exports.ruleName = ruleName
module.exports.messages = messages
