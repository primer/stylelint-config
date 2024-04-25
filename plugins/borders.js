import stylelint from 'stylelint'
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex.cjs'
import valueParser from 'postcss-value-parser'
import borderSizes from '@primer/primitives/dist/styleLint/functional/size/border.json' with {type: 'json'}

const sizes = []
const radii = []
for (const variable of Object.keys(borderSizes)) {
  if (variable.includes('borderWidth')) {
    const value = borderSizes[variable]['value'].replace(/max|\(|\)/g, '').split(',')[0]
    sizes.push({
      name: `--${variable}`,
      values: [value],
    })
  }

  if (variable.includes('borderRadius')) {
    const value = borderSizes[variable]['value']
    radii.push({
      name: `--${variable}`,
      values: value,
    })
  }
}

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

export const ruleName = 'primer/borders'
export const messages = ruleMessages(ruleName, {
  rejected: (value, replacement) => {
    if (!replacement) {
      return `Please use a primer size variable instead of '${value}'. Consult the primer docs for a suitable replacement. https://primer.style/foundations/primitives/size`
    }

    return `Please replace '${value}' with size variable '${replacement['name']}'. https://primer.style/foundations/primitives/size`
  },
})

const meta = {
  fixable: true,
}

// Props that we want to check
const propList = ['border', 'border-width', 'border-radius']

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    })
    const validValues = [...sizes, ...radii]

    if (!validOptions) return

    root.walkDecls(declNode => {
      const {prop, value} = declNode

      if (!propList.some(borderProp => prop.startsWith(borderProp))) return

      const problems = []

      const parsedValue = walkGroups(valueParser(value), node => {
        const checkForVariable = (vars, nodeValue) => vars.some(variable =>
          new RegExp(`${variable['name'].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(nodeValue),
        )

        // Only check word types. https://github.com/TrySound/postcss-value-parser#word
        if (node.type !== 'word') {
          return
        }

        // TODO: figure out a better way to forbid border styles other than 'solid' and 'dashed'
        // Exact values to ignore.
        if (['*', '+', '-', '/', '0', 'none', 'inherit', 'initial', 'revert', 'revert-layer', 'unset', 'solid', 'dashed'].includes(node.value)) {
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
          prop.includes('width') || prop === 'border'
        ) {
          if (checkForVariable(sizes, node.value)) {
            return
          }
        }

        if (
          prop.includes('radius')
        ) {
          if (checkForVariable(radii, node.value)) {
            return
          }
        }

        const replacement = validValues.find(variable => variable.values.includes(node.value.replace('-', '')))
        const fixable = replacement && valueUnit && !valueUnit.number.includes('-')

        if (fixable && context.fix) {
          node.value = node.value.replace(node.value, `var(${replacement['name']})`)
        } else {
          problems.push({
            index: declarationValueIndex(declNode) + node.sourceIndex,
            endIndex: declarationValueIndex(declNode) + node.sourceIndex + node.value.length,
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
            endIndex: err.endIndex,
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