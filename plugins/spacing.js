import stylelint from 'stylelint'
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex.mjs'
import valueParser from 'postcss-value-parser'
import docValues from '@primer/primitives/tokens-v2-private/docs/docValues.json' with {type: 'json'}

const sizes = docValues['tokens/base/size/size.json'].map(size => {
  return {
    name: `--${size['name']}`,
    values: Object.values(size['original']).concat(size['value']),
  }
})

const {
  createPlugin,
  utils: {report, ruleMessages, validateOptions},
} = stylelint

const walkGroups = (root, validate) => {
  for (const node of root.nodes) {
    if (node.type === 'function') {
      walkGroups(node, validate)
    } else {
      validate(node)
    }
  }
  return root
}

export const ruleName = 'primer/spacing'
export const messages = ruleMessages(ruleName, {
  rejected: (value, replacement) => {
    if (!replacement) {
      return `Please use a primer size variable instead of '${value}'. Consult the primer docs for a suitable replacement. https://primer.style/foundations/primitives/size`
    }

    return `Please replace '${value}' with size variable '${replacement['name']}'.`
  },
})

const meta = {
  fixable: true,
}

// Props that we want to check
const propList = ['padding', 'margin']

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    })

    if (!validOptions) return

    root.walkDecls(declNode => {
      const {prop, value} = declNode

      if (!propList.some(spacingProp => prop.includes(spacingProp))) return

      const problems = []

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

        if (fixable && context.fix) {
          node.value = node.value.replace(node.value, `var(${replacement['name']})`)
        } else {
          problems.push({
            index: declarationValueIndex(declNode) + node.sourceIndex,
            message: messages.rejected(node.value, replacement),
          })
        }

        return
      })

      if (context.fix) {
        declNode.value = parsedValue.toString()
      }

      if (problems.length) {
        for (const err of problems) {
          report({
            index: err.index,
            message: err.message,
            node: declNode,
            result,
            ruleName,
          })
        }
      }
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = meta

export default createPlugin(ruleName, ruleFunction)
