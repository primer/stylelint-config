const stylelint = require('stylelint')
const matchAll = require('string.prototype.matchall')

const ruleName = 'primer/no-undefined-vars'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: varName => `${varName} is not defined`
})

// TODO: Get this list from @primer/primitives
const vars = ['--color-text-primary']

module.exports = stylelint.createPlugin(ruleName, enabled => {
  if (!enabled) {
    return noop
  }

  return (root, result) => {
    root.walkRules(rule => {
      rule.walkDecls(decl => {
        // Match CSS variable references (e.g var(--color-text-primary))
        // eslint-disable-next-line no-useless-escape
        const varRegex = /var\(([^\)]*)\)/g
        for (const [, varName] of matchAll(decl.value, varRegex)) {
          if (!vars.includes(varName)) {
            stylelint.utils.report({
              message: messages.rejected(varName),
              node: decl,
              result,
              ruleName
            })
          }
        }
      })
    })
  }
})

function noop() {}

module.exports.ruleName = ruleName
module.exports.messages = messages
