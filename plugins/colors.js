import stylelint from 'stylelint'
import {declarationValueIndex} from 'stylelint/lib/utils/nodeFieldIndices.cjs'
import {primitivesVariables, hasValidColor} from './lib/utils.js'
import valueParser from 'postcss-value-parser'

const {
  createPlugin,
  utils: {report, ruleMessages, validateOptions},
} = stylelint

export const ruleName = 'primer/colors'
export const messages = ruleMessages(ruleName, {
  rejected: (value, type) => {
    if (type === 'fg') {
      return `Please use a Primer foreground color variable instead of '${value}'. https://primer.style/foundations/primitives/color#foreground`
    } else if (type === 'bg') {
      return `Please use a Primer background color variable instead of '${value}'. https://primer.style/foundations/primitives/color#background`
    } else if (type === 'border') {
      return `Please use a Primer border color variable instead of '${value}'. https://primer.style/foundations/primitives/color#border`
    }
    return `Please use with a Primer color variable instead of '${value}'. https://primer.style/foundations/primitives/color`
  },
})

let variables = primitivesVariables('colors')
const validProps = {
  '^color$': ['fgColor', 'iconColor'],
  '^background(-color)?$': ['bgColor'],
  '^border(-top|-right|-bottom|-left|-inline|-block)*(-color)?$': ['borderColor'],
  '^fill$': ['fgColor', 'iconColor', 'bgColor'],
  '^stroke$': ['fgColor', 'iconColor', 'bgColor', 'borderColor'],
}

const validValues = [
  'none',
  'currentcolor',
  'inherit',
  'initial',
  'unset',
  'revert',
  'revert-layer',
  'transparent',
  '0',
]

const propType = prop => {
  if (/^color/.test(prop)) {
    return 'fg'
  } else if (/^background(-color)?$/.test(prop)) {
    return 'bg'
  } else if (/^border(-top|-right|-bottom|-left|-inline|-block)*(-color)?$/.test(prop)) {
    return 'border'
  } else if (/^fill$/.test(prop)) {
    return 'fg'
  } else if (/^stroke$/.test(prop)) {
    return 'fg'
  }
  return undefined
}

variables = variables.filter(variable => {
  const name = variable['name']
  // remove shadow and boxShadow variables
  return !(name.includes('shadow') || name.includes('boxShadow'))
})

/** @type {import('stylelint').Rule} */
const ruleFunction = primary => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    })
    if (!validOptions) return

    const valueIsCorrectType = (value, types) => types.some(type => value.includes(type))

    root.walkDecls(declNode => {
      const {prop, value} = declNode

      // Skip if prop is not a valid color prop
      if (!Object.keys(validProps).some(validProp => new RegExp(validProp).test(prop))) return

      // Get the valid types for the prop
      const types = validProps[Object.keys(validProps).find(re => new RegExp(re).test(prop))]

      // Walk the value split
      valueParser(value).walk(valueNode => {
        // Skip if value is not a word or function
        if (valueNode.type !== 'word' && valueNode.type !== 'function') return

        // Skip if value is a valid value
        if (validValues.includes(valueNode.value)) return

        if (hasValidColor(valueNode.value) || /^\$/.test(valueNode.value)) {
          const rejectedValue =
            valueNode.type === 'function'
              ? `${valueNode.value}(${valueParser.stringify(valueNode.nodes)})`
              : valueNode.value

          report({
            index: declarationValueIndex(declNode) + valueNode.sourceIndex,
            endIndex: declarationValueIndex(declNode) + valueNode.sourceEndIndex,
            message: messages.rejected(rejectedValue, propType(prop)),
            node: declNode,
            result,
            ruleName,
          })
          return
        }

        // Skip functions
        if (valueNode.type === 'function') {
          return
        }

        // Variable exists and is the correct type (fg, bg, border)
        if (
          variables.some(variable => new RegExp(variable['name']).test(valueNode.value)) &&
          valueIsCorrectType(valueNode.value, types)
        ) {
          return
        }

        // Value doesn't start with variable --
        if (!valueNode.value.startsWith('--')) {
          return
        }

        // Ignore old system colors --color-*
        if (
          [
            /^--color-(?:[a-zA-Z0-9-]+-)*text(?:-[a-zA-Z0-9-]+)*$/,
            /^--color-(?:[a-zA-Z0-9-](?!-))*-fg(?:-[a-zA-Z0-9-]+)*$/,
            /^--color-[^)]+$/,
          ].some(oldSysRe => oldSysRe.test(valueNode.value))
        ) {
          return
        }

        // Property is shortand and value doesn't include color
        if (
          (/^border(-top|-right|-bottom|-left|-inline|-block)*$/.test(prop) || /^background$/.test(prop)) &&
          !valueNode.value.toLowerCase().includes('color')
        ) {
          return
        }

        report({
          index: declarationValueIndex(declNode) + valueNode.sourceIndex,
          endIndex: declarationValueIndex(declNode) + valueNode.sourceEndIndex,
          message: messages.rejected(`var(${valueNode.value})`, propType(prop)),
          node: declNode,
          result,
          ruleName,
        })
      })
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = {
  fixable: false,
}

export default createPlugin(ruleName, ruleFunction)
