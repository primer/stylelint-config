import stylelint from 'stylelint'
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex.mjs'
import designTokens from '@primer/primitives/tokens-v2-private/docs/docValues.json' assert {type: 'json'}

export const ruleName = 'primer/no-experimental-vars'
export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: value => {
    return `Do not use experimental variable \`var(--${value})\`. Experimental variables are undergoing testing, see https://github.com/github/primer/issues/889 for more details.`
  },
})

// eslint-disable-next-line no-unused-vars
export default stylelint.createPlugin(ruleName, (enabled, options = {}, context) => {
  if (!enabled) {
    return noop
  }

  const experimentalVars = new Set()
  for (const tokenType of Object.keys(designTokens)) {
    for (const token of designTokens[tokenType].map(t => t['name'])) {
      experimentalVars.add(token)
    }
  }

  const lintResult = (root, result) => {
    root.walkDecls(decl => {
      for (const expVar of experimentalVars) {
        // console.log(expVar, decl.value.includes(`var(--${expVar})`))
        if (decl.value.includes(`var(--${expVar})`)) {
          stylelint.utils.report({
            index: declarationValueIndex(decl),
            message: messages.rejected(expVar),
            node: decl,
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
