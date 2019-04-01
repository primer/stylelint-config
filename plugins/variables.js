const stylelint = require('stylelint')
const {readVariablesFromImports} = require('../src/variables')

const ruleName = 'primer/variables'

const primerSupportPath = require.resolve('@primer/css/support/index.scss')
const primerSupportVars = readVariablesFromImports(primerSupportPath)

const ALLOWED_STATIC_VALUES = new Set(['currentColor', 'inherit', 'none', 'transparent'])
const DIRS = ['top', 'right', 'bottom', 'left']

const PROP_CATEGORIES = {
  color: {
    props: ['color', 'background-color', 'border-color', ...DIRS.map(dir => `border-${dir}-color`)],
    allowedValues: ['currentColor', 'inherit', 'transparent']
  },
  spacing: {
    props: ['margin', 'padding', ...DIRS.map(dir => `margin-${dir}`), ...DIRS.map(dir => `padding-{dir}`)],
    allowedValues: ['0']
  },
  typography: {
    props: ['font-size', 'font-weight', 'line-height'],
    allowedValues: ['inherit', '1em', '0']
  }
}

const getCategoryForProperty = propertyCategorizer(PROP_CATEGORIES)

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: enabled,
      possible: [true, false]
    })

    if (!validOptions) {
      return
    }

    const messages = stylelint.utils.ruleMessages(ruleName, {
      rejected: message => message
    })

    root.walkDecls(decl => {
      const {prop, value} = decl
      const category = getCategoryForProperty(prop)
      if (category && !isValidValue(decl, category)) {
        const {name, allowedValues} = category
        let message = `Please use a ${name} variable for "${prop}" instead of "${value}"`
        /*
        if (allowedValues && allowedValues.length) {
          message = `${message}, or one of: "${allowedValues.join('", "')}"`
        }
        */
        stylelint.utils.report({
          message: messages.rejected(`${message}.`),
          node: decl,
          result,
          ruleName
        })
      }
    })
  }
})

function propertyCategorizer(categories) {
  const propertyMap = new Map()
  for (const [name, {props, allowedValues}] of Object.entries(categories)) {
    for (const prop of props) {
      propertyMap.set(prop, {name, allowedValues})
    }
  }
  return (prop, value) => propertyMap.get(prop)
}

function isValidValue(decl, category) {
  const {prop, value} = decl
  const {allowedValues, allowedVariables} = category
  if (allowedValues.includes(value)) {
    return true
  }
  return includesVariable(value, allowedVariables)
}

function includesVariable(value, allowed) {
  const matches = value.match(/\$([-\w]+)/g)
  if (allowed && matches) {
    for (const match of matches) {
      if (!(match in allowed)) {
        return false
      }
    }
  } else if (matches) {
    return true
  }
  return false
}
