import stylelint from 'stylelint'
import {createRequire} from 'module'

export const ruleName = 'primer/new-color-vars-have-fallback'
export const messages = stylelint.utils.ruleMessages(ruleName, {
  expectedFallback: variable =>
    `Expected a fallback value for CSS variable ${variable}. New color variables fallbacks, check primer.style/primitives to find the correct value`,
})

export default stylelint.createPlugin(ruleName, enabled => {
  const require = createRequire(import.meta.url)
  const variables = require('./lib/new-color-css-vars-map.json')

  if (!enabled) {
    return noop
  }

  return (root, result) => {
    root.walkDecls(node => {
      for (const variable of variables) {
        if (node.value.includes(`var(${variable})`)) {
          // Check if the declaration uses a CSS variable from the JSON
          const match = node.value.match(new RegExp(`var\\(${variable},(.*)\\)`))
          if (!match || match[1].trim() === '') {
            stylelint.utils.report({
              ruleName,
              result,
              node,
              message: messages.expectedFallback(variable),
            })
          }
        }
      }
    })
  }
})

function noop() {}
