const stylelint = require('stylelint')
const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')
const valueParser = require('postcss-value-parser')

// TODO: Pull this in from primer/primitives
const spacerValues = {
  '$spacer-1': '4px',
  '$spacer-2': '8px',
  '$spacer-3': '16px',
  '$spacer-4': '24px',
  '$spacer-5': '32px',
  '$spacer-6': '40px',
  '$spacer-7': '48px',
  '$spacer-8': '64px',
  '$spacer-9': '80px',
  '$spacer-10': '96px',
  '$spacer-11': '112px',
  '$spacer-12': '128px',
  '$em-spacer-1': '0.0625em',
  '$em-spacer-2': '0.125em',
  '$em-spacer-3': '0.25em',
  '$em-spacer-4': '0.375em',
  '$em-spacer-5': '0.5em',
  '$em-spacer-6': '0.75em',
}

const ruleName = 'primer/spacing'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value, replacement) => {
    if (replacement === null) {
      return `Please use a primer spacer variable instead of '${value}'. Consult the primer docs for a suitable replacement. https://primer.style/css/support/spacing`
    }

    return `Please replace ${value} with spacing variable '${replacement}'.`
  },
})

const walkGroups = (root, validate) => {
  for (const node of root.nodes) {
    if (node.type === 'function') {
      walkGroups(node, validate)
    } else {
      validate(node)
    }
  }
  return root
}

// eslint-disable-next-line no-unused-vars
module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}, context) => {
  if (!enabled) {
    return noop
  }

  const lintResult = (root, result) => {
    root.walk(decl => {
      if (decl.type !== 'decl' || !decl.prop.match(/^(padding|margin)/)) {
        return noop
      }

      const problems = []

      const parsedValue = walkGroups(valueParser(decl.value), node => {
        // Remove leading negative sign, if any.
        const cleanValue = node.value.replace(/^-/g, '')

        // Only check word types. https://github.com/TrySound/postcss-value-parser#word
        if (node.type !== 'word') {
          return
        }

        // Exact values to ignore.
        if (['*', '+', '-', '/', '0', 'auto', 'inherit', 'initial'].includes(node.value)) {
          return
        }

        const valueUnit = valueParser.unit(cleanValue)

        if (valueUnit && (valueUnit.unit === '' || !/^[0-9.]+$/.test(valueUnit.number))) {
          return
        }

        // If the a variable is found in the value, skip it.
        if (
          Object.keys(spacerValues).some(variable =>
            new RegExp(`${variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(cleanValue),
          )
        ) {
          return
        }

        const replacement = Object.keys(spacerValues).find(spacer => spacerValues[spacer] === cleanValue) || null
        const valueMatch = replacement ? spacerValues[replacement] : node.value

        if (replacement && context.fix) {
          node.value = node.value.replace(valueMatch, replacement)
        } else {
          problems.push({
            index: declarationValueIndex(decl) + node.sourceIndex,
            message: messages.rejected(valueMatch, replacement),
          })
        }

        return
      })

      if (context.fix) {
        decl.value = parsedValue.toString()
      }

      if (problems.length) {
        for (const err of problems) {
          stylelint.utils.report({
            index: err.index,
            message: err.message,
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

module.exports.ruleName = ruleName
module.exports.messages = messages
