const fs = require('fs')
const stylelint = require('stylelint')
const matchAll = require('string.prototype.matchall')
const globby = require('globby')

const ruleName = 'primer/no-undefined-vars'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: varName => `${varName} is not defined`
})

// Match CSS variable definitions (e.g. --color-text-primary:)
const variableDefinitionRegex = /(--[\w|-]*):/g

// Match CSS variable references (e.g var(--color-text-primary))
// eslint-disable-next-line no-useless-escape
const variableReferenceRegex = /var\(([^\)]*)\)/g

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  if (!enabled) {
    return noop
  }

  const {files = ['**/*.scss', '!node_modules']} = options

  const definedVariables = getDefinedVariables(files)

  return (root, result) => {
    root.walkRules(rule => {
      rule.walkDecls(decl => {
        for (const [, variableName] of matchAll(decl.value, variableReferenceRegex)) {
          if (!definedVariables.has(variableName)) {
            stylelint.utils.report({
              message: messages.rejected(variableName),
              node: decl,
              result,
              ruleName
            })
          }
        }
      })
    })
  }
})

function getDefinedVariables(files) {
  const definedVariables = new Set()

  for (const file of globby.sync(files)) {
    const css = fs.readFileSync(file, 'utf-8')
    for (const [, variableName] of matchAll(css, variableDefinitionRegex)) {
      definedVariables.add(variableName)
    }
  }

  return definedVariables
}

function noop() {}

module.exports.ruleName = ruleName
module.exports.messages = messages
