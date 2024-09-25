import stylelint from 'stylelint'
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex.cjs'
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

      if (!Object.keys(validProps).some(validProp => new RegExp(validProp).test(prop))) return
      if (validValues.includes(value)) return

      for (const re in validProps) {
        const types = validProps[re]
        if (new RegExp(re).test(prop)) {
          valueParser(value).walk(valueNode => {
            if (valueNode.type !== 'word' && valueNode.type !== 'function') return

            if (hasValidColor(valueNode.value)) {
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

            if (
              variables.some(variable => new RegExp(variable['name']).test(valueNode.value)) &&
              valueIsCorrectType(valueNode.value, types)
            ) {
              return
            }

            if (!valueNode.value.includes('Color')) {
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
        }
      }
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = {
  fixable: false,
}

export default createPlugin(ruleName, ruleFunction)
