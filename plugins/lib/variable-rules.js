import stylelint from 'stylelint'
import declarationValidator from './decl-validator.js'
import variables from '@primer/css/dist/variables.json' with {type: 'json'}

export const CSS_IMPORTANT = '!important'
export const CSS_DIRECTIONS = ['top', 'right', 'bottom', 'left']
export const CSS_CORNERS = ['top-right', 'bottom-right', 'bottom-left', 'top-left']

export function createVariableRule(ruleName, rules, url) {
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
    const {disableFix} = options
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
            return
          } else if (fixEnabled && fixable) {
            decl.value = replacement
          } else {
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
