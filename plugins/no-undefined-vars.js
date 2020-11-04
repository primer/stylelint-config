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

// Match CSS variables defined with the color-mode-var mixin (e.g. @include color-mode-var(my-feature, ...))
const colorModeVariableDefinitionRegex = /color-mode-var\s*\(\s*['"]?([^'",]+)['"]?/g

// Match CSS variable references (e.g var(--color-text-primary))
// eslint-disable-next-line no-useless-escape
const variableReferenceRegex = /var\(([^\),]+)(,.*)?\)/g

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
    function checkVariable(variableName, node) {
      if (!definedVariables.has(variableName)) {
        stylelint.utils.report({
          message: messages.rejected(variableName),
          node,
          result,
          ruleName
        })
      }
    }

    root.walkAtRules(rule => {
      if (rule.name === "include" && rule.params.startsWith('color-mode-var')) {
        const innerMatch = rule.params.match(/^color-mode-var\s*\(\s*(.*)\)\s*$/)
        if (innerMatch.length !== 2) {
          return
        }

        const [, params] = innerMatch
        const [, lightValue, darkValue] = params.split(',').map(str => str.trim())

        for (const v of [lightValue, darkValue]) {
          for (const [, variableName] of matchAll(v, variableReferenceRegex)) {
            checkVariable(variableName, rule)
          }
        }
      }
    })

    root.walkRules(rule => {
      rule.walkDecls(decl => {
        if (seen.has(decl)) {
          return
        } else {
          seen.set(decl, true)
        }

        for (const [, variableName] of matchAll(decl.value, variableReferenceRegex)) {
          checkVariable(variableName, decl)
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
      for (const [, variableName] of matchAll(css, colorModeVariableDefinitionRegex)) {
        log(`--color-${variableName} defined via color-mode-var in ${file}`)
        definedVariables.add(`--color-${variableName}`)
      }
    }

    return definedVariables
  })
}

function noop() {}

module.exports.ruleName = ruleName
module.exports.messages = messages
