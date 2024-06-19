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
    // TODO: Decide if we just want to link to Storybook, or if we want to add new pages to https://primer.style/foundations/primitives
    if (!replacement) {
      return `Please use a Primer box-shadow variable instead of '${value}'. Consult the primer docs for a suitable replacement. https://primer.style/primitives/storybook/?path=/story/color-functional-shadows--shadows`
    }

    return `Please replace '${value}' with a Primer box-shadow variable '${replacement['name']}'. https://primer.style/primitives/storybook/?path=/story/color-functional-shadows--shadows`
  },
})

const variables = primitivesVariables('box-shadow')
const shadows = []

for (const variable of variables) {
  const name = variable['name']

  // TODO: Decide if this is safe. Someday we might have variables that
  // have 'shadow' in the name but aren't full box-shadows.
  if (name.includes('shadow')) {
    shadows.push(variable)
  }
}

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    })
    const validValues = shadows

    if (!validOptions) return

    // TODO: determine if it's safe to look at the whole declaration value
    // instead of each node in the value
    root.walkDecls(declNode => {
      const {prop, value} = declNode

      if (prop !== 'box-shadow') return

      if (value === 'none') return

      const problems = []

      const checkForVariable = (vars, nodeValue) => {
        return vars.some(variable =>
          new RegExp(`${variable['name'].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(nodeValue),
        )
      }

      if (checkForVariable(validValues, value)) {
        return
      }

      const replacement = validValues.find(variable => variable.values.includes(value))

      if (replacement && context.fix) {
        declNode.value = value.replace(value, `var(${replacement['name']})`)
      } else {
        problems.push({
          index: declarationValueIndex(declNode),
          endIndex: declarationValueIndex(declNode) + value.length,
          message: messages.rejected(value, replacement),
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
