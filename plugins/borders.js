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
  rejected: (value, replacement, propName) => {
    if  (propName && propName.includes('radius') && value.includes('borderWidth')) {
      return `Border radius variables can not be used for border widths`
    }

    if  (propName && propName.includes('width') || propName === 'border' && value.includes('borderRadius')) {
      return `Border width variables can not be used for border radii`
    }


    if (!replacement) {
      return `Please use a Primer border variable instead of '${value}'. Consult the primer docs for a suitable replacement. https://primer.style/foundations/primitives/size#border`
    }

    return `Please replace '${value}' with a Primer border variable '${replacement['name']}'. https://primer.style/foundations/primitives/size#border`
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

        // if we're looking at the border property that sets color in shorthand, don't bother checking the color
        if (
          // using border shorthand
          prop === 'border' &&
          // includes a color as a third space-separated value
          value.split(' ').length > 2 &&
          // the color in the third space-separated value includes `node.value`
          value.split(' ').slice(2).some(color => color.includes(node.value))
        ) {
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
            message: messages.rejected(node.value, replacement, prop),
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