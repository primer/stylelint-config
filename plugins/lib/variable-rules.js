const matchAll = require('string.prototype.matchall')
const stylelint = require('stylelint')
const declarationValidator = require('./decl-validator')

const CSS_IMPORTANT = '!important'
const CSS_DIRECTIONS = ['top', 'right', 'bottom', 'left']
const CSS_CORNERS = ['top-right', 'bottom-right', 'bottom-left', 'top-left']

module.exports = {
  createVariableRule,
  reverseAssignments,
  CSS_DIRECTIONS,
  CSS_CORNERS,
  CSS_IMPORTANT
}

function createVariableRule(ruleName, rules) {
  const variables = require('@primer/css/dist/variables.json')
  const validate = declarationValidator(rules, {variables})

  return stylelint.createPlugin(ruleName, (enabled, options = {}, context) => {
    if (enabled === false) {
      return noop
    }

    const messages = stylelint.utils.ruleMessages(ruleName, {
      rejected: message => `${message}.`
    })

    // The stylelint docs suggest respecting a "disableFix" rule option that
    // overrides the "global" context.fix (--fix) linting option.
    const {verbose = false, disableFix} = options
    const fixEnabled = context && context.fix && !disableFix

    return (root, result) => {
      root.walkDecls(decl => {
        const validated = validate(decl)
        const {valid, fixable, replacement, errors} = validated
        if (valid) {
          // eslint-disable-next-line no-console
          if (verbose) console.warn(`  valid!`)
          return
        } else if (fixEnabled && fixable) {
          // eslint-disable-next-line no-console
          if (verbose) console.warn(`  fixed: ${replacement}`)
          decl.value = replacement
        } else {
          // eslint-disable-next-line no-console
          if (verbose) console.warn(`  ${errors.length} error(s)`)
          for (const error of errors) {
            stylelint.utils.report({
              message: messages.rejected(error),
              node: decl,
              result,
              ruleName
            })
          }
        }
      })
    }
  })
}

function noop() {}

function reverseAssignments(css) {
  const map = {}
  // eslint-disable-next-line no-unused-vars
  for (const [_, left, right] of matchAll(css, /(\$[-\w]+):\s+([^!]+) !default;/g)) {
    map[right] = left
  }
  return map
}
