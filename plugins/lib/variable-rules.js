const stylelint = require('stylelint')
const {requirePrimerFile} = require('./primer')
const declarationValidator = require('./decl-validator')

const CSS_IMPORTANT = '!important'
const CSS_DIRECTIONS = ['top', 'right', 'bottom', 'left']
const CSS_CORNERS = ['top-right', 'bottom-right', 'bottom-left', 'top-left']

module.exports = {
  createVariableRule,
  CSS_DIRECTIONS,
  CSS_CORNERS,
  CSS_IMPORTANT,
}

function createVariableRule(ruleName, rules, url) {
  let variables = {}
  try {
    variables = requirePrimerFile('dist/variables.json')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Unable to get variables.json from @primer/css. Replacements will need to be specified manually.`)
  }

  const plugin = stylelint.createPlugin(ruleName, (enabled, options = {}, context) => {
    if (enabled === false) {
      return noop
    }

    let actualRules = rules
    let overrides = options.rules
    if (typeof rules === 'function') {
      actualRules = rules({variables, options, ruleName})
    } else {
      actualRules = Object.assign({}, rules)
    }
    if (typeof overrides === 'function') {
      delete options.rules
      overrides = overrides({rules: actualRules, options, ruleName, variables})
    }
    if (overrides) {
      Object.assign(actualRules, overrides)
    }
    const validate = declarationValidator(actualRules, {variables})

    // The stylelint docs suggest respecting a "disableFix" rule option that
    // overrides the "global" context.fix (--fix) linting option.
    const {verbose = false, disableFix} = options
    const fixEnabled = context && context.fix && !disableFix
    const seen = new WeakMap()

    return (root, result) => {
      root.walkRules(rule => {
        rule.walkDecls(decl => {
          if (seen.has(decl)) {
            return
          } else {
            seen.set(decl, true)
          }

          const validated = validate(decl)
          const {valid, fixable, replacement, errors} = validated
          if (valid) {
            // eslint-disable-next-line no-console
            if (verbose) console.warn(`valid: "${decl.toString()}" in: "${rule.selector}"`)
            return
          } else if (fixEnabled && fixable) {
            // eslint-disable-next-line no-console
            if (verbose) console.warn(`  fixed: ${replacement}`)
            decl.value = replacement
          } else {
            // eslint-disable-next-line no-console
            if (verbose) console.warn(`  ${errors.length} error(s)`)
            for (const error of errors) {
              const message = stylelint.utils
                .ruleMessages(ruleName, {
                  rejected: m => {
                    if (url) {
                      return `${m}. See ${url}.`
                    }
                    return `${m}.`
                  },
                })
                .rejected(error)

              stylelint.utils.report({
                message,
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

  Object.assign(plugin, {rules})

  return plugin
}

function noop() {}
