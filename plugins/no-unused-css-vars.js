const stylelint = require('stylelint')
const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')

const ruleName = 'primer/no-unused-css-vars'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: value => {
    return `test`
  }
})

// Match CSS variable references (e.g var(--color-text-primary))
// eslint-disable-next-line no-useless-escape
const variableReferenceRegex = /var\(([^\),]+)(,.*)?\)/g

// eslint-disable-next-line no-unused-vars
module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}, context) => {
  if (!enabled) {
    return noop
  }

  // eslint-disable-next-line import/no-dynamic-require
  //   const designTokens = require(options.designTokens)

  //   let experimentalVars = null
  //   for (const tokenType of Object.keys(designTokens)) {
  //     experimentalVars = new Set(designTokens[tokenType].map(t => t['name']))
  //   }

  const lintResult = (root, result) => {
    root.walkDecls(decl => {
      for (const expVar of experimentalVars) {
        if (decl.value.includes(`var(--${expVar})`)) {
          stylelint.utils.report({
            index: declarationValueIndex(decl),
            message: messages.rejected(expVar),
            node: decl,
            result,
            ruleName
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
