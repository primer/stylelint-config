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
    root.walkRules(rule => {
      rule.walkDecls(decl => {
        // Match CSS variable references (e.g var(--color-text-primary))
        const varRegex = /var\([^\)]*\)/g
        for (const varReference of decl.value.match(varRegex)) {
          console.log(varReference)
        }
      })
    })

    // stylelint.utils.report({
    //   message: messages.rejected,
    //   node: root,
    //   result,
    //   ruleName
    // })
  }
})

function noop() {}
