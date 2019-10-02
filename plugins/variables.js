const minimatch = require('minimatch')
const stylelint = require('stylelint')
const TapMap = require('tap-map')

const ruleName = 'primer/variables'

const DEFAULT_PROPS = require('./lib/variable-props')

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  const {categories = DEFAULT_PROPS} = options
  const cache = new TapMap()
  const entries = Object.entries(categories).map(([propPattern, category]) =>
    Object.assign(
      {
        match: minimatch.filter(propPattern)
      },
      {name: propPattern},
      category
    )
  )

  return (root, result) => {
    if (enabled === false) {
      return
    }

    const messages = stylelint.utils.ruleMessages(ruleName, {
      rejected: message => message
    })

    root.walkDecls(decl => check(decl))

    function check(decl, prop = decl.prop, value = decl.value) {
      const category = cache.tap(prop, () => entries.find(entry => entry.match(prop)))
      if (category) {
        const {name} = category
        const tokens = splitTokens(value)
        if (tokens.length > 1 && Array.isArray(category.components)) {
          for (const [index, comp] of Object.entries(category.components)) {
            check(decl, comp, tokens[index])
          }
        } else {
          for (const token of tokens) {
            if (!hasValue(category, token)) {
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

function hasValue(category, value) {
  const {values, test = v => values.some(p => minimatch(v, p))} = category
  return test(value)
}

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
