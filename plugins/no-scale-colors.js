const stylelint = require('stylelint')
const matchAll = require('string.prototype.matchall')

const ruleName = 'primer/no-scale-colors'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: varName =>
    `${varName} is a non-functional scale color and cannot be used without being wrapped in the color-variables mixin`,
})

// Match CSS variable references (e.g var(--color-text-primary))
// eslint-disable-next-line no-useless-escape
const variableReferenceRegex = /var\(([^\),]+)(,.*)?\)/g

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  if (!enabled) {
    return noop
  }

  const {verbose = false} = options
  // eslint-disable-next-line no-console
  const log = verbose ? (...args) => console.warn(...args) : noop

  // Keep track of declarations we've already seen
  const seen = new WeakMap()

  return (root, result) => {
    root.walkRules(rule => {
      rule.walkDecls(decl => {
        if (seen.has(decl)) {
          return
        } else {
          seen.set(decl, true)
        }

        for (const [, variableName] of matchAll(decl.value, variableReferenceRegex)) {
          log(`Found variable reference ${variableName}`)
          if (variableName.match(/^--color-(scale|auto)-/)) {
            stylelint.utils.report({
              message: messages.rejected(variableName),
              node: decl,
              result,
              ruleName,
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
