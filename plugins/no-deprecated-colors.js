const stylelint = require('stylelint')
const kebabCase = require('lodash.kebabcase')
const matchAll = require('string.prototype.matchall')

const ruleName = 'primer/no-deprecated-colors'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (varName, replacement) => {
    if (replacement === null) {
      return `${varName} is a deprecated color variable. Please consult the primer color docs for a replacement. https://primer.style/primitives`
    }

    if (Array.isArray(replacement)) {
      replacement = replacement.map(r => `--color-${kebabCase(r)}`)
      return `${varName} is a deprecated color variable. Please use one of (${replacement.join(', ')}).`
    }

    replacement = `--color-${kebabCase(replacement)}`
    return `${varName} is a deprecated color variable. Please use the replacement ${replacement}.`
  }
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

  // eslint-disable-next-line import/no-dynamic-require
  const deprecatedColors = require(options.deprecatedFile || '@primer/primitives/dist/deprecations/colors.json')

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
              message: messages.rejected(variableName, replacement),
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
