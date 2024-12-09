import stylelint from 'stylelint'
import {declarationValueIndex} from 'stylelint/lib/utils/nodeFieldIndices.cjs'
import valueParser from 'postcss-value-parser'
import {primitivesVariables, walkGroups} from './lib/utils.js'

const {
  createPlugin,
  utils: {report, ruleMessages, validateOptions},
} = stylelint

export const ruleName = 'primer/spacing'
export const messages = ruleMessages(ruleName, {
  rejected: (value, replacement) => {
    if (!replacement) {
      return `Please use a primer size variable instead of '${value}'. Consult the primer docs for a suitable replacement. https://primer.style/foundations/primitives/size`
    }

    return `Please replace '${value}' with size variable '${replacement['name']}'. https://primer.style/foundations/primitives/size`
  },
})

// Props that we want to check
const propList = ['padding', 'margin', 'top', 'right', 'bottom', 'left']
// Values that we want to ignore
const valueList = ['${']

const sizes = primitivesVariables('spacing')

// Add +-1px to each value
for (const size of sizes) {
  const values = size['values']
  const px = parseInt(values.find(value => value.includes('px')))
  if (![2, 6].includes(px)) {
    values.push(`${px + 1}px`)
    values.push(`${px - 1}px`)
  }
}

/** @type {import('stylelint').Rule} */
const ruleFunction = primary => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    })

    if (!validOptions) return

    root.walkDecls(declNode => {
      const {prop, value} = declNode

      if (!propList.some(spacingProp => prop.startsWith(spacingProp))) return
      if (valueList.some(valueToIgnore => value.includes(valueToIgnore))) return

      const parsedValue = walkGroups(valueParser(value), node => {
        // Only check word types. https://github.com/TrySound/postcss-value-parser#word
        if (node.type !== 'word') {
          return
        }

        // Exact values to ignore.
        if (['*', '+', '-', '/', '0', 'auto', 'inherit', 'initial'].includes(node.value)) {
          return
        }

        const valueUnit = valueParser.unit(node.value)

        if (valueUnit && (valueUnit.unit === '' || !/^-?[0-9.]+$/.test(valueUnit.number))) {
          return
        }

        // Skip if the value unit isn't a supported unit.
        if (valueUnit && !['px', 'rem', 'em'].includes(valueUnit.unit)) {
          return
        }

        // If the variable is found in the value, skip it.
        if (
          sizes.some(variable =>
            new RegExp(`${variable['name'].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(node.value),
          )
        ) {
          return
        }

        const replacement = sizes.find(variable => variable.values.includes(node.value.replace('-', '')))
        const fixable = replacement && valueUnit && !valueUnit.number.includes('-')
        let fix = undefined
        if (fixable) {
          fix = () => {
            node.value = node.value.replace(node.value, `var(${replacement['name']})`)
          }
        }
        report({
          index: declarationValueIndex(declNode) + node.sourceIndex,
          endIndex: declarationValueIndex(declNode) + node.sourceIndex + node.value.length,
          message: messages.rejected(node.value, replacement),
          node: declNode,
          result,
          ruleName,
          fix,
        })
      })

      declNode.value = parsedValue.toString()
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = {
  fixable: true,
}

export default createPlugin(ruleName, ruleFunction)
