import stylelint from 'stylelint'
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex.cjs'
import valueParser from 'postcss-value-parser'
import {walkGroups, primitivesVariables} from './lib/utils.js'

const {
  createPlugin,
  utils: {report, ruleMessages},
} = stylelint

export const ruleName = 'primer/borders'
export const messages = ruleMessages(ruleName, {
  rejected: (value, replacement, propName) => {
    if (propName && propName.includes('radius') && value.includes('borderWidth')) {
      return `Border radius variables can not be used for border widths`
    }

    if ((propName && propName.includes('width')) || (propName === 'border' && value.includes('borderRadius'))) {
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

const indentifyBorder = (prop, value) => {
  const borderProperties = {
    color: undefined,
    width: undefined,
    style: undefined,
    radius: undefined,
  }

  const match = prop.match(/^border(-top|-right|-bottom|-left)*(-color|-radius|-style|-width)?$/)
  if (!match) return borderProperties

  const [, , property] = match

  if (property) {
    switch (property) {
      case '-color':
        borderProperties.color = value
        break
      case '-width':
        borderProperties.width = value
        break
      case '-style':
        borderProperties.style = value
        break
      case '-radius':
        borderProperties.radius = value
        break
    }
  } else if (prop === 'border') {
    const parsedValue = valueParser(value)
    const values = parsedValue.nodes
      .filter(node => node.type === 'word' || node.type === 'function')
      .map(node => node.value)
    console.log(values)
  }

  return borderProperties
}

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary, secondaryOptions, context) => {
  return (root, result) => {
    root.walkDecls(declNode => {
      const {prop, value} = declNode

      if (!propList.some(borderProp => prop.startsWith(borderProp))) return

      const problems = []

      console.log(indentifyBorder(prop, value))

      return
      const parsedValue = walkGroups(valueParser(value), node => {
        const nodeValue = node.value
        // console.log(indentifyBorder(prop, nodeValue))

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
          prop === 'border' &&
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
        if (prop.includes('width') || prop === 'border') {
          if (checkForVariable(sizes, node.value)) {
            return
          }
        }

        if (prop.includes('radius')) {
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
ruleFunction.meta = {
  fixable: true,
}

export default createPlugin(ruleName, ruleFunction)
