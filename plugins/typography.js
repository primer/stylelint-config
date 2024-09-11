import stylelint from 'stylelint'
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex.cjs'
import {primitivesVariables} from './lib/utils.js'

const {
  createPlugin,
  utils: {report, ruleMessages, validateOptions},
} = stylelint

export const ruleName = 'primer/typography'
export const messages = ruleMessages(ruleName, {
  rejected: (value, replacement) => {
    // no possible replacement
    if (!replacement) {
      return `Please use a Primer typography variable instead of '${value}'. Consult the primer docs for a suitable replacement. https://primer.style/foundations/primitives/typography`
    }

    // multiple possible replacements
    if (replacement.length) {
      return `Please use one of the following Primer typography variables instead of '${value}': ${replacement.map(replacementObj => `'${replacementObj.name}'`).join(', ')}. https://primer.style/foundations/primitives/typography`
    }

    // one possible replacement
    return `Please replace '${value}' with Primer typography variable '${replacement['name']}'. https://primer.style/foundations/primitives/typography`
  },
})

const fontWeightKeywordMap = {
  normal: 400,
  bold: 600,
  bolder: 600,
  lighter: 300,
}
const getClosestFontWeight = (goalWeightNumber, fontWeightsTokens) => {
  return fontWeightsTokens.reduce((prev, curr) =>
    Math.abs(curr.values - goalWeightNumber) < Math.abs(prev.values - goalWeightNumber) ? curr : prev,
  ).values
}

const variables = primitivesVariables('typography')
const fontSizes = []
const fontWeights = []
const lineHeights = []
const fontStacks = []
const fontShorthands = []

// Props that we want to check for typography variables
const propList = ['font-size', 'font-weight', 'line-height', 'font-family', 'font']

for (const variable of variables) {
  const name = variable['name']

  if (name.includes('size')) {
    fontSizes.push(variable)
  }

  if (name.includes('weight')) {
    fontWeights.push(variable)
  }

  if (name.includes('lineHeight')) {
    lineHeights.push(variable)
  }

  if (name.includes('fontStack')) {
    fontStacks.push(variable)
  }

  if (name.includes('shorthand')) {
    fontShorthands.push(variable)
  }
}

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    })
    let validValues = []

    if (!validOptions) return

    root.walkDecls(declNode => {
      const {prop, value} = declNode

      if (!propList.some(typographyProp => prop.startsWith(typographyProp))) return

      const problems = []

      const checkForVariable = (vars, nodeValue) =>
        vars.some(variable =>
          new RegExp(`${variable['name'].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(nodeValue),
        )

      // Exact values to ignore.
      if (value === 'inherit') {
        return
      }

      switch (prop) {
        case 'font-size':
          validValues = fontSizes
          break
        case 'font-weight':
          validValues = fontWeights
          break
        case 'line-height':
          validValues = lineHeights
          break
        case 'font-family':
          validValues = fontStacks
          break
        case 'font':
          validValues = fontShorthands
          break
        default:
          validValues = []
      }

      if (checkForVariable(validValues, value)) {
        return
      }

      const getReplacements = () => {
        const replacementTokens = validValues.filter(variable => {
          if (!(variable.values instanceof Array)) {
            let nodeValue = value

            if (prop === 'font-weight') {
              nodeValue = getClosestFontWeight(fontWeightKeywordMap[value] || value, fontWeights)
            }

            return variable.values.toString() === nodeValue.toString()
          }

          return variable.values.includes(value.replace('-', ''))
        })

        if (!replacementTokens.length) {
          return
        }

        if (replacementTokens.length > 1) {
          return replacementTokens
        }

        return replacementTokens[0]
      }
      const replacement = getReplacements()
      const fixable = replacement && !replacement.length

      if (fixable && context.fix) {
        declNode.value = value.replace(value, `var(${replacement['name']})`)
      } else {
        problems.push({
          index: declarationValueIndex(declNode),
          endIndex: declarationValueIndex(declNode) + value.length,
          message: messages.rejected(value, replacement, prop),
        })
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
