import stylelint from 'stylelint'
import sizes from './lib/size.json' assert { type: 'json' }


// console.log(Object.keys(sizes))

const {
  createPlugin,
  utils: {report, ruleMessages, validateOptions},
} = stylelint

export const ruleName = 'primer/spacing'

const messages = ruleMessages(ruleName, {
  rejected: (value, replacement) => {
    if (replacement === null) {
      return `Please use a primer size variable instead of '${value}'. Consult the primer docs for a suitable replacement. https://primer.style/foundations/primitives/size`
    }

    return `Please replace ${value} with size variable '--${replacement}'.`
  },
})

const meta = {
  url: 'https://primer.style/foundations/primitives/size',
}

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

      if(!value.match(/(px|rem)/gi)) return
      let replacement = null
      Object.keys(sizes).forEach(element => {
        if(sizes[element]["values"].includes(value)) {
          replacement = element
          return
        }
      });

      if(context.fix) {
        declNode.value = `var(--${replacement})`
        return
      }

      report({
        result,
        ruleName,
        message: messages.rejected(value, replacement),
        node: declNode,
        word: value,
      })
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = meta

export default createPlugin(ruleName, ruleFunction)
