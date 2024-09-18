import stylelint from 'stylelint'
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex.cjs'
import {primitivesVariables} from './lib/utils.js'

const {
  createPlugin,
  utils: {report, ruleMessages, validateOptions},
} = stylelint

export const ruleName = 'primer/box-shadow'
export const messages = ruleMessages(ruleName, {
  rejected: (value, replacement) => {
    if (!replacement) {
      return `Please use a Primer box-shadow variable instead of '${value}'. Consult the primer docs for a suitable replacement. https://primer.style/foundations/primitives/color#shadow or https://primer.style/foundations/primitives/size#border-size`
    }

    return `Please replace '${value}' with a Primer box-shadow variable '${replacement['name']}'. https://primer.style/foundations/primitives/color#shadow or https://primer.style/foundations/primitives/size#border-size`
  },
})

const variables = primitivesVariables('box-shadow')
const shadows = []

for (const variable of variables) {
  const name = variable['name']

  // TODO: Decide if this is safe. Someday we might have variables that
  // have 'shadow' in the name but aren't full box-shadows.
  if (name.includes('shadow') || name.includes('boxShadow')) {
    shadows.push(variable)
  }
}

/** @type {import('stylelint').Rule} */
const ruleFunction = primary => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    })
    const validValues = shadows

    if (!validOptions) return

    root.walkDecls(declNode => {
      const {prop, value} = declNode

      if (prop !== 'box-shadow') return

      if (value === 'none') return

      const checkForVariable = (vars, nodeValue) => {
        return vars.some(variable =>
          new RegExp(`${variable['name'].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(nodeValue),
        )
      }

      if (checkForVariable(validValues, value)) {
        return
      }

      const replacement = validValues.find(variable => variable.values.includes(value))
      let fix = undefined
      if (replacement) {
        fix = () => {
          declNode.value = value.replace(value, `var(${replacement['name']})`)
        }
      }

      report({
        index: declarationValueIndex(declNode),
        endIndex: declarationValueIndex(declNode) + value.length,
        message: messages.rejected(value, replacement),
        node: declNode,
        result,
        ruleName,
        fix,
      })
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = {
  fixable: true,
}

export default createPlugin(ruleName, ruleFunction)
