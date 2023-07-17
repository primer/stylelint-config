const stylelint = require('stylelint')
const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')
const valueParser = require('postcss-value-parser')

const ruleName = 'primer/responsive-widths'

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: value => {
    return `A value larger than the smallest viewport could break responsive pages. Use a width value smaller than ${value}. https://primer.style/css/support/breakpoints`
  },
})

// 320px is the smallest viewport size that we support

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
      // Ignore things inside of breakpoints
      if (decl.type === 'atrule' && decl.name === 'include' && decl.params.includes('breakpoint')) {
        return false
      }

      if (decl.type !== 'decl' || !decl.prop.match(/^(min-width|width)/)) {
        return noop
      }

      const problems = []

      walkGroups(valueParser(decl.value), node => {
        // Only check word types. https://github.com/TrySound/postcss-value-parser#word
        if (node.type !== 'word') {
          return
        }

        // Exact values to ignore.
        if (['*', '+', '-', '/', '0', 'auto', 'inherit', 'initial'].includes(node.value)) {
          return
        }

        const valueUnit = valueParser.unit(node.value)

        switch (valueUnit.unit) {
          case 'px':
            if (parseInt(valueUnit.number) > 320) {
              problems.push({
                index: declarationValueIndex(decl) + node.sourceIndex,
                message: messages.rejected(node.value),
              })
            }
            break
          case 'vw':
            if (parseInt(valueUnit.number) > 100) {
              problems.push({
                index: declarationValueIndex(decl) + node.sourceIndex,
                message: messages.rejected(node.value),
              })
            }
            break
        }
      })

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
