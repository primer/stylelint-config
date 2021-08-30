const stylelint = require('stylelint')
const kebabCase = require('lodash.kebabcase')
const deprecatedColors = require('@primer/primitives/dist/deprecations/colors_v2.json')
const matchAll = require('string.prototype.matchall')

const ruleName = 'primer/no-deprecated-colors'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: varName => `${varName} is a deprecated color, please use the alternative.`
})

// Match CSS variable references (e.g var(--color-text-primary))
// eslint-disable-next-line no-useless-escape
const variableReferenceRegex = /var\(([^\),]+)(,.*)?\)/g

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}, context) => {
  if (!enabled) {
    return noop
  }

  const {verbose = false} = options
  // eslint-disable-next-line no-console
  const log = verbose ? (...args) => console.warn(...args) : noop

  // Keep track of declarations we've already seen
  const seen = new WeakMap()

  const convertedCSSVars = Object.entries(deprecatedColors)
    .map(([k, v]) => {
      return [`--color-${kebabCase(k)}`, v]
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})

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
          if (variableName in convertedCSSVars) {
            let replacement = convertedCSSVars[variableName]

            if (context.fix && replacement !== null && !Array.isArray(replacement)) {
              replacement = `--color-${kebabCase(replacement)}`
              decl.value = decl.value.replace(variableName, replacement)
              return
            }

            stylelint.utils.report({
              message: messages.rejected(variableName),
              node: decl,
              ruleName,
              result
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
