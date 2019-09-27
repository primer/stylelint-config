const stylelint = require('stylelint')

const ruleName = 'primer/variables'

const DIRS = ['top', 'right', 'bottom', 'left']

const PROP_CATEGORIES = {
  bg: {
    name: 'background color',
    props: ['background-color'],
    allowedValues: ['transparent', 'none'],
    allowedVariables: [/^\$bg-/]
  },
  color: {
    props: ['color', 'border-color', ...DIRS.map(dir => `border-${dir}-color`)],
    allowedValues: ['currentColor', 'inherit', 'transparent']
  },
  spacing: {
    props: ['margin', 'padding', ...DIRS.map(dir => `margin-${dir}`), ...DIRS.map(dir => `padding-${dir}`)],
    allowedValues: ['0']
  },
  borders: {
    props: ['border', 'border-width', ...DIRS.map(dir => `border-${dir}-width`)],
    allowedVariables: [/^\$border/]
  },
  typography: {
    props: ['font-size', 'font-weight', 'line-height'],
    allowedValues: ['inherit', '1em', '0']
  }
}

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  const {categories = PROP_CATEGORIES} = options
  const getCategoryForProperty = propertyCategorizer(categories)

  return (root, result) => {
    if (enabled === false) {
      return
    }

    const messages = stylelint.utils.ruleMessages(ruleName, {
      rejected: message => message
    })

    root.walkDecls(decl => {
      const {prop, value} = decl
      const category = getCategoryForProperty(prop)
      if (category && !isValidValue(decl, category)) {
        const {name} = category
        const message = `Please use a ${name} variable for "${prop}" instead of "${value}"`
        /*
        const {allowedValues} = category
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
  for (const [name, category] of Object.entries(categories)) {
    if (!category.name) {
      category.name = name
    }
    for (const prop of category.props) {
      propertyMap.set(prop, category)
    }
  }
  return prop => propertyMap.get(prop)
}

function isValidValue(decl, category) {
  const {value} = decl
  const {allowedValues, allowedVariables} = category
  if (allowedValues.includes(value)) {
    return true
  }
  return includesValidVariable(value, allowedVariables)
}

function includesValidVariable(value, allowedVariables) {
  const matches = value.match(/\$([-\w]+)/g)
  if (allowedVariables && matches) {
    for (const variable of matches) {
      if (allowedVariables.some(pattern => pattern.test(variable))) {
        return true
      }
    }
  } else if (matches) {
    return true
  }
  return false
}
