const stylelint = require('stylelint')

const ruleName = 'primer/new-color-vars-have-fallback'
const messages = stylelint.utils.ruleMessages(ruleName, {
  expectedFallback: variable =>
    `Expected a fallback value for CSS variable ${variable}. New color variables fallbacks, check primer.style/primitives to find the correct value`,
})

const fs = require('fs')
const path = require('path')

const jsonFilePath = 'node_modules/@primer/primitives/tokens-next-private/docs/functional/themes/light.json'
let jsonContent

try {
  const fileContent = fs.readFileSync(path.resolve(jsonFilePath), 'utf8')
  jsonContent = JSON.parse(fileContent)
  // console.log('JSON content:', jsonContent) // Log to see the content
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Error reading JSON file:', error)
}

module.exports = stylelint.createPlugin(ruleName, enabled => {
  if (!enabled) {
    return noop
  }

  return (root, result) => {
    root.walkDecls(decl => {
      for (const key of Object.keys(jsonContent)) {
        if (decl.value.includes(`var(--${key})`)) {
          // Check if the declaration uses a CSS variable from the JSON
          const match = decl.value.match(/var\(--\w+,(.*)\)/)
          if (!match || match[1].trim() === '') {
            stylelint.utils.report({
              ruleName,
              result,
              node: decl,
              message: messages.expectedFallback(`--${key}`),
            })
          }
        }
      }
    })
  }
})

function noop() {}

module.exports.ruleName = ruleName
module.exports.messages = messages
