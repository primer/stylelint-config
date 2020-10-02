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

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  if (!enabled) {
    return noop
  }

  const {files = ['**/*.scss', '!node_modules'], verbose = false} = options
  // eslint-disable-next-line no-console
  const log = verbose ? (...args) => console.warn(...args) : noop
  const definedVariables = getDefinedVariables(files, log)

  // Keep track of declarations we've already seen
  const seen = new WeakMap()

  return (root, result) => {
    root.walkRules(rule => {
      rule.walkDecls(decl => {
        if (seen.has(decl)) {
          return
        } else {
          seen.set(decl, true)
        }

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

const cwd = process.cwd()
const cache = new TapMap()

function getDefinedVariables(files, log) {
  const cacheKey = JSON.stringify({files, cwd})
  return cache.tap(cacheKey, () => {
    const definedVariables = new Set()

    for (const file of globby.sync(files)) {
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
