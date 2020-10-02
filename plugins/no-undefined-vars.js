const fs = require('fs')
const stylelint = require('stylelint')
const matchAll = require('string.prototype.matchall')
const globby = require('globby')
const TapMap = require('tap-map')

const ruleName = 'primer/no-undefined-vars'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: varName => `${varName} is not defined`
})

// Match CSS variable definitions (e.g. --color-text-primary:)
const variableDefinitionRegex = /(--[\w|-]*):/g

// Match CSS variable references (e.g var(--color-text-primary))
// eslint-disable-next-line no-useless-escape
const variableReferenceRegex = /var\(([^\)]*)\)/g

const cwd = process.cwd()
const cache = new TapMap()

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  if (!enabled) {
    return noop
  }

  const {files = ['**/*.scss', '!node_modules'], verbose = false} = options
  // eslint-disable-next-line no-console
  const log = verbose ? (...args) => console.warn(...args) : noop
  const cacheOptions = {files, cwd}
  const definedVariables = getDefinedVariables(cacheOptions, log)

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

function getDefinedVariables(cacheOptions, log) {
  const cacheKey = JSON.stringify(cacheOptions)
  return cache.tap(cacheKey, () => {
    const definedVariables = new Set()
    for (const file of globby.sync(cacheOptions.files)) {
      const css = fs.readFileSync(file, 'utf-8')
      for (const [, variableName] of matchAll(css, variableDefinitionRegex)) {
        log(`${variableName} defined in ${file}`)
        definedVariables.add(variableName)
      }
    }

    return definedVariables
  })
}

function noop() {}

module.exports.ruleName = ruleName
module.exports.messages = messages
