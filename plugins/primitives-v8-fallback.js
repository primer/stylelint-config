const stylelint = require('stylelint')
const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')

const ruleName = 'primer/primitives-v8-fallback'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: value => {
    return `\`var(--${value})\` requires a fallback value of the deprecated token. See https://primer.style/primitives/storybook/?path=/story/migration-tables to find the correct token.`
  }
})

// eslint-disable-next-line no-unused-vars
module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}, context) => {
  if (!enabled) {
    return noop
  }

  // eslint-disable-next-line import/no-dynamic-require
  const designTokens = require(options.designTokens)

  let experimentalVars = null
  for (const tokenType of Object.keys(designTokens)) {
    experimentalVars = new Set(designTokens[tokenType].map(t => t['name']))
  }

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
