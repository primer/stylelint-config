const stylelint = require('stylelint')
const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')
const valueParser = require('postcss-value-parser')

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
  '$em-spacer-6': '0.75em'
}

const ruleName = 'primer/spacing'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value, replacement) => {
    if (replacement === null) {
      return `Please use a primer spacer variable instead of '${value}'. Consult the primer docs for a suitable replacement. https://primer.style/css/support/spacing`
    }

    return `Please replace ${value} with spacing variable '${replacement}'.`
  }
})

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
      let containsMath = false
      let conatinsVariable = false
      const parsedValue = valueParser(decl.value).walk(declValue => {
        // Only check word types. https://github.com/TrySound/postcss-value-parser#word
        if (!['word', 'function'].includes(declValue.type)) {
          return false
        }

        // Ignore values that are not numbers.
        if (['0', 'auto', 'inherit', 'initial'].includes(declValue.value)) {
          return noop
        }
        // Remove leading negative sign, if any.
        const cleanDeclValue = declValue.value.replace(/^-/g, '')

        // If the a variable is found in the value, skip it.
        if (
          Object.keys(spacerValues).some(variable =>
            new RegExp(`${variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(cleanDeclValue)
          )
        ) {
          conatinsVariable = true
          return noop
        }

        // For now we're going to ignore math.
        if (['*', '+', '-', '/'].includes(declValue.value)) {
          containsMath = true
          return noop
        }

        let valueMatch = null
        if ((valueMatch = Object.keys(spacerValues).find(spacer => spacerValues[spacer] === cleanDeclValue))) {
          if (context.fix) {
            declValue.value = declValue.value.replace(spacerValues[valueMatch], valueMatch)
          } else {
            problems.push({
              index: declarationValueIndex(decl) + declValue.sourceIndex,
              message: messages.rejected(spacerValues[valueMatch], valueMatch)
            })
          }
        } else if (declValue.value !== '' && declValue.type !== 'function' && !containsMath) {
          problems.push({
            index: declarationValueIndex(decl) + declValue.sourceIndex,
            message: messages.rejected(declValue.value, null)
          })
        }
      })

      if (context.fix) {
        decl.value = parsedValue.toString()
      }

      if (containsMath && conatinsVariable) {
        return noop
      }

      if (problems.length) {
        for (const err of problems) {
          stylelint.utils.report({
            index: err.index,
            message: err.message,
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
