const minimatch = require('minimatch')
const stylelint = require('stylelint')
const TapMap = require('tap-map')

const ruleName = 'primer/variables'

const DEFAULT_RULES = require('./lib/variable-rules')

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  const rules = Object.assign({}, DEFAULT_RULES, options.rules)
  const cache = new TapMap()
  const entries = Object.entries(rules).map(([name, rule]) => {
    if (!rule.props) {
      // eslint-disable-next-line no-console
      console.warn(`[${ruleName}] rule "${name}" has no .props; the name will be used.`)
      rule.props = name
    }
    return Object.assign({name, match: matchAny(rule.props)}, rule)
  })

  return (root, result) => {
    if (enabled === false) {
      return
    }

    const messages = stylelint.utils.ruleMessages(ruleName, {
      rejected: message => message
    })

    root.walkDecls(decl => check(decl))

    function check(decl, prop = decl.prop, value = decl.value) {
      const rule = cache.tap(prop, () => entries.find(entry => entry.match(prop)))
      if (rule) {
        const {name} = rule
        const tokens = splitTokens(value)
        if (tokens.length > 1 && Array.isArray(rule.components)) {
          for (const [index, comp] of Object.entries(rule.components)) {
            check(decl, comp, tokens[index])
          }
        } else {
          for (const token of tokens) {
            if (!hasValue(rule, token)) {
              const message = `Please use a ${name} variable instead of "${value}"`
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
    }
  }
})

function hasValue(rule, value) {
  const {values, test = v => values.some(p => minimatch(v, p))} = rule
  return test(value)
}

/**
 * In order to recognize "components" of compound properties like
 * border and font, we have to know how to split up a CSS property
 * value string into its constituent parts. However, just splitting on
 * spaces isn't good enough, for instance:
 *
 * ```css
 * border: ($spacer-2 - 1) solid lighten($gray-300, 4%);
 * ```
 *
 * Math expressions, functions, and nested instances of each are
 * treated as singular "tokens", so the above value would yield:
 *
 * 1. "($spacer-2 - 1)"
 * 2. "solid"
 * 3. "lighten($gray-300, 4%)"
 */
function splitTokens(value) {
  const tokens = []
  let token = ''
  let parens = 0
  for (let i = 0; i < value.length; i++) {
    const chr = value.charAt(i)
    if (chr === '(') {
      token += chr
      parens++
    } else if (parens) {
      token += chr
      if (chr === ')') {
        if (--parens === 0) {
          tokens.push(token)
          token = ''
        }
      }
    } else if (chr === ' ') {
      if (token) {
        tokens.push(token)
      }
      token = ''
    } else {
      token += chr
    }
  }
  if (token) {
    tokens.push(token)
  }
  return tokens.map(token => token.replace(/,$/, ''))
}

function matchAny(pattern) {
  return Array.isArray(pattern) ? filterSome(pattern) : minimatch.filter(pattern)
}

function filterSome(patterns) {
  const filters = patterns.map(pattern => minimatch.filter(pattern))
  return value => filters.some(filter => filter(value))
}
