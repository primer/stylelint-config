import primitivesV8 from '../__tests__/__fixtures__/primitives-v8.json'
const stylelint = require('stylelint')
const kebabCase = require('lodash.kebabcase')
const matchAll = require('string.prototype.matchall')

const ruleName = 'primer/no-deprecated-colors'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (varName, replacement) => {
    if (replacement === null) {
      return `${varName} is a deprecated color variable. Please consult the primer color docs for a replacement. https://primer.style/primitives`
    }

    if (typeof replacement === Object) {
      replacement = replacement.map(r => `--${kebabCase(r)}`)
      return `${varName} is a deprecated color variable. Please use one of (${replacement.join(', ')}).`
    }

    replacement = `--${replacement}`
    return `${varName} is a deprecated color variable. Please use the replacement ${replacement}.`
  }
})

// Match CSS variable references (e.g var(--color-text-primary))
// eslint-disable-next-line no-useless-escape
const variableReferenceRegex = /var\(([^\),]+)(,.*)?\)/g

const replacedVars = {}
const newVars = {}

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
  // const deprecatedColors = {
  //   "--color-done-emphasis": {
  //     "background": "--bgColor-done-emphasis",
  //     "border": "--borderColor-done-emphasis"
  //   },
  // }

  //require(options.deprecatedFile || '@primer/primitives/dist/deprecated/colors.json')
  // eslint-disable-next-line import/no-dynamic-require
  const removedColors = {} //require(options.removedFile || '@primer/primitives/dist/removed/colors.json')

  const variableChecks = Object.assign(primitivesV8, removedColors)

  const convertedCSSVars = Object.entries(variableChecks)
  .map(([k, v]) => {
    return [`--${k}`, v]
  })
  .reduce((acc, [key, value]) => {
    acc[key] = value
    return acc
  }, {})

  console.log(convertedCSSVars)

  const lintResult = (root, result) => {
    // Walk all declarations
    root.walk(node => {
      if (seen.has(node)) {
        return
      } else {
        seen.set(node, true)
      }

      // walk these nodes
      if (!(node.type === 'decl' || node.type === 'atrule')) {
        return
      }

      for (const [, variableName] of matchAll(
        node.type === 'atrule' ? node.params : node.value,
        variableReferenceRegex
      )) {
        if (variableName in convertedCSSVars) {
          let replacement = convertedCSSVars[variableName]

          if(typeof(replacement) === 'object') {
            for(const property of Object.keys(replacement)) {
              console.log(node.prop)
              if(node.prop.includes(property)) {
                replacement = replacement[property]
                break
              }
            }
          }

          if (context.fix && replacement !== null) {
            replacement = `--${replacement}, var(${variableName})`
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
            message: messages.rejected(variableName, replacement),
            node,
            ruleName,
            result
          })
        }
      }
    })
  }

  log(
    `${Object.keys(replacedVars).length} deprecated variables replaced with ${Object.keys(newVars).length} variables.`
  )
  return lintResult
})

function noop() {}

module.exports.ruleName = ruleName
module.exports.messages = messages
