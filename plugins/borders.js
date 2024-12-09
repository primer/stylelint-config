import stylelint from 'stylelint'
import {declarationValueIndex} from 'stylelint/lib/utils/nodeFieldIndices.cjs'
import valueParser from 'postcss-value-parser'
import {walkGroups, primitivesVariables} from './lib/utils.js'

const {
  createPlugin,
  utils: {report, ruleMessages, validateOptions},
} = stylelint

export const ruleName = 'primer/borders'
export const messages = ruleMessages(ruleName, {
  rejected: (value, replacement, propName) => {
    if (propName && propName.includes('radius') && value.includes('borderWidth')) {
      return `Border radius variables can not be used for border widths`
    }

    if ((propName && propName.includes('width')) || (borderShorthand(propName) && value.includes('borderRadius'))) {
      return `Border width variables can not be used for border radii`
    }

    if (!replacement) {
      return `Please use a Primer border variable instead of '${value}'. Consult the primer docs for a suitable replacement. https://primer.style/foundations/primitives/size#border`
    }

    return `Please replace '${value}' with a Primer border variable '${replacement['name']}'. https://primer.style/foundations/primitives/size#border`
  },
})

const variables = primitivesVariables('border')
const sizes = []
const radii = []

// Props that we want to check
const propList = ['border', 'border-width', 'border-radius']
// Values that we want to ignore
const valueList = ['${']

const borderShorthand = prop =>
  /^border(-(top|right|bottom|left|block-start|block-end|inline-start|inline-end))?$/.test(prop)

for (const variable of variables) {
  const name = variable['name']

  if (name.includes('borderWidth')) {
    const value = variable['values']
      .pop()
      .replace(/max|\(|\)/g, '')
      .split(',')[0]
    sizes.push({
      name,
      values: [value],
    })
  }

  if (name.includes('borderRadius')) {
    radii.push(variable)
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

      if (!propList.some(borderProp => prop.startsWith(borderProp))) return
      if (/^border(-(top|right|bottom|left|block-start|block-end|inline-start|inline-end))?-color$/.test(prop)) return
      if (valueList.some(valueToIgnore => value.includes(valueToIgnore))) return

      const parsedValue = walkGroups(valueParser(value), node => {
        const checkForVariable = (vars, nodeValue) =>
          vars.some(variable =>
            new RegExp(`${variable['name'].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(nodeValue),
          )

        // Only check word types. https://github.com/TrySound/postcss-value-parser#word
        if (node.type !== 'word') {
          return
        }

        // Exact values to ignore.
        if (
          [
            '*',
            '+',
            '-',
            '/',
            '0',
            'none',
            'inherit',
            'initial',
            'revert',
            'revert-layer',
            'unset',
            'solid',
            'dashed',
            'dotted',
            'transparent',
          ].includes(node.value)
        ) {
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
          borderShorthand(prop) &&
          // includes a color as a third space-separated value
          value.split(' ').length > 2 &&
          // the color in the third space-separated value includes `node.value`
          value
            .split(' ')
            .slice(2)
            .some(color => color.includes(node.value))
        ) {
          return
        }

        // If the variable is found in the value, skip it.
        if (prop.includes('width') || borderShorthand(prop)) {
          if (checkForVariable(sizes, node.value)) {
            return
          }
        }

        if (prop.includes('radius')) {
          if (checkForVariable(radii, node.value)) {
            return
          }
        }

        const replacement = (prop.includes('radius') ? radii : sizes).find(variable =>
          variable.values.includes(node.value.replace('-', '')),
        )
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
          message: messages.rejected(node.value, replacement, prop),
          node: declNode,
          result,
          ruleName,
          fix,
        })

        return
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
