const anymatch = require('anymatch')
const stylelint = require('stylelint')
const TapMap = require('tap-map')
const braces = require('braces')
const {splitTokens} = require('./lib/tokens')

const ruleName = 'primer/variables'
const IMPORTANT = '!important'

const DEFAULT_RULES = require('./lib/variable-rules')

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}, context = {}) => {
  if (enabled === false) {
    return noop
  }

  // The stylelint docs suggest respecting a "disableFix" rule option that
  // overrides the "global" context.fix (--fix) linting option.
  const fixEnabled = context.fix && !options.disableFix
  const {verbose = false} = options

  /* Rules are keyed on their name so that it's easy to override or disable
   * them while still "inheriting" the defaults:
   *
   * ```js
   * 'primer/variables': [true, {
   *   rules: {
   *     'background color': false,
   *     'text color': {
   *       props: ['fill', 'color'],
   *       values: ['$text-*', '$fill-*', 'transparent', 'currentColor']
   *     }
   *   }
   * }
   * ```
   */
  const rules = Object.assign({}, DEFAULT_RULES, options.rules)
  const cache = new TapMap()
  const tokenReplacementsByProperty = new Map()
  const entries = Object.entries(rules)
    .map(([name, rule]) => {
      if (!rule) {
        return false
      } else if (!rule.props && verbose) {
        // eslint-disable-next-line no-console
        console.warn(`[${ruleName}] rule "${name}" has no .props; the name will be used.`)
        rule.props = name
      }
      return Object.assign(
        {
          name,
          match: anymatch(rule.props),
          replacements: {}
        },
        rule,
        {
          testValue: getRuleValueTester(rule)
        }
      )
    })
    .filter(Boolean)

  for (const entry of entries) {
    const props = arrayify(entry.props).flatMap(braces.expand)
    for (const prop of props) {
      for (const [token, replacement] of Object.entries(entry.replacements)) {
        tokenReplacementsByProperty.set(`${prop}:${token}`, replacement)
        if (verbose) {
          // eslint-disable-next-line no-console
          console.warn(`replace: {${prop}: ${token}} -> "${replacement}"`)
        }
      }
    }
  }

  return (root, result) => {
    const messages = stylelint.utils.ruleMessages(ruleName, {
      rejected: message => message
    })

    root.walkDecls(decl => check(decl))

    function check(decl, prop = decl.prop, value = decl.value) {
      let replacementKey = `${prop}:${value}`
      let message
      if (prop === decl.prop && tokenReplacementsByProperty.has(replacementKey)) {
        const replacement = tokenReplacementsByProperty.get(replacementKey)
        if (fixEnabled) {
          decl.value = replacement
        } else {
          message = `Please use "${replacement}" instead of "${value}"`
        }
      }

      const rule = cache.tap(prop, () => entries.find(entry => entry.match(prop)))
      if (rule) {
        const {name} = rule
        const tokens = splitTokens(value)
        let fixed = false
        if (tokens.length > 1 && Array.isArray(rule.components)) {
          for (const [index, comp] of Object.entries(rule.components)) {
            const token = tokens[index]
            const fixedToken = check(decl, comp, token)
            if (fixEnabled && fixedToken) {
              tokens[index] = fixedToken
              fixed = true
            }
          }
        } else {
          for (const [index, token] of Object.entries(tokens)) {
            replacementKey = `${prop}:${token}`
            if (fixEnabled && rule.replacements.hasOwnProperty(token)) {
              tokens[index] = rule.replacements[token]
              fixed = true
            } else if (tokenReplacementsByProperty.has(replacementKey)) {
              const replacement = tokenReplacementsByProperty.get(replacementKey)
              if (verbose) {
                // eslint-disable-next-line no-console
                console.warn(`found exact replacement for {${prop}: ${token}}: "${replacement}"`)
              }
              if (fixEnabled) {
                tokens[index] = replacement
                fixed = true
              } else {
                message = `Please use "${replacement}" instead of "${token}"`
                break
              }
            } else if (!rule.testValue(token)) {
              message = `Please use a ${name} variable instead of "${value}"`
              break
            }
          }
        }

        if (fixed) {
          if (prop === decl.prop) {
            decl.value = tokens.join(' ')
          } else {
            return tokens.join(' ')
          }
        } else if (message) {
          stylelint.utils.report({
            message: messages.rejected(`${message}.`),
            node: decl,
            result,
            ruleName
          })
        }
      }
    }
  }
})

// export the default rules object so that it can be built on
Object.assign(module.exports, {DEFAULT_RULES})

function getRuleValueTester(rule) {
  const {values = []} = rule
  const match = anymatch(values)
  return v => v === IMPORTANT || match(v)
}

function noop() {}

function arrayify(value) {
  return Array.isArray(value) ? value : [value]
}
