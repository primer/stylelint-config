const stylelint = require('stylelint')
const matchAll = require('string.prototype.matchall')

const ruleName = 'primer/no-deprecated-colors'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (varName, replacement, property) => {
    if (replacement === null) {
      return `Variable ${varName} is deprecated for property ${property}. Please consult the primer color docs for a replacement. https://primer.style/primitives/storybook/?path=/story/migration-tables`
    }

    return `Variable ${varName} is deprecated for property ${property}. Please use the replacement ${replacement}.`
  },
})

// Match CSS variable references (e.g var(--color-text-primary))
// eslint-disable-next-line no-useless-escape
const variableReferenceRegex = /var\(([^\),]+)(,.*)?\)/g

const replacedVars = {}
const newVars = {}

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}, context) => {
  const {inlineFallback = false} = options

  if (!enabled) {
    return noop
  }

  const {verbose = false} = options
  // eslint-disable-next-line no-console
  const log = verbose ? (...args) => console.warn(...args) : noop

  // Keep track of declarations we've already seen
  const seen = new WeakMap()

  // eslint-disable-next-line import/no-dynamic-require
  const variableChecks = require(options.deprecatedFile || './lib/primitives-v8.json')

  const lintResult = (root, result) => {
    // Walk all declarations
    root.walk(node => {
      if (seen.has(node)) {
        return
      } else {
        seen.set(node, true)
      }

      // walk these nodes
      if (node.type !== 'decl') {
        return
      }

      for (const [, variableName] of matchAll(node.value, variableReferenceRegex)) {
        if (variableName in variableChecks) {
          let replacement = variableChecks[variableName]
          if (typeof replacement === 'object') {
            if (node.prop) {
              for (const prop of replacement) {
                // Check if node.prop starts with one of the props array elements
                if (prop['props'].some(p => node.prop.startsWith(p))) {
                  replacement = prop['replacement']
                  break
                }
              }
            }
            if (typeof replacement === 'object') {
              replacement = null
            }
          }

          if (context.fix && replacement !== null) {
            replacement = `${replacement}${inlineFallback ? `, var(${variableName})` : ''}`
            replacedVars[variableName] = true
            newVars[replacement] = true
            if (node.type === 'atrule') {
              node.params = node.params.replace(variableName, replacement)
            } else {
              node.value = node.value.replace(variableName, replacement)
            }
            continue
          }

          stylelint.utils.report({
            message: messages.rejected(variableName, replacement, node.prop),
            node,
            ruleName,
            result,
          })
        }
      }
    })
  }

  log(
    `${Object.keys(replacedVars).length} deprecated variables replaced with ${Object.keys(newVars).length} variables.`,
  )
  return lintResult
})

function noop() {}

module.exports.ruleName = ruleName
module.exports.messages = messages
