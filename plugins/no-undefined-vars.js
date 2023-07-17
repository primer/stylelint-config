const fs = require('fs')
const stylelint = require('stylelint')
const matchAll = require('string.prototype.matchall')
const globby = require('globby')
const TapMap = require('tap-map')

const ruleName = 'primer/no-undefined-vars'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: varName => `${varName} is not defined`,
})

// Match CSS variable definitions (e.g. --color-text-primary:)
const variableDefinitionRegex = /^\s*(--[\w|-]+):/gm

// Match CSS variables defined with the color-variables mixin
const colorModeVariableDefinitionRegex = /^[^/\n]*\(["']?([^'"\s,]+)["']?,\s*\(light|dark:/gm

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
  const globalDefinedVariables = getDefinedVariables(files, log)
  // Keep track of declarations we've already seen
  const seen = new WeakMap()

  return (root, result) => {
    const fileDefinedVariables = new Set()

    function checkVariable(variableName, node, allowed) {
      if (!allowed.has(variableName)) {
        stylelint.utils.report({
          message: messages.rejected(variableName),
          node,
          result,
          ruleName,
        })
      }
    }

    root.walkAtRules(rule => {
      if (rule.name === 'include' && rule.params.startsWith('color-variables')) {
        const innerMatch = [...matchAll(rule.params, variableReferenceRegex)]
        if (!innerMatch.length) {
          return
        }

        for (const [, variableName] of innerMatch) {
          checkVariable(variableName, rule, new Set([...globalDefinedVariables, ...fileDefinedVariables]))
        }
      }
    })

    root.walkRules(rule => {
      const scopeDefinedVaribles = new Set()

      rule.walkDecls(decl => {
        // Add CSS variable declarations within the source text to the list of allowed variables
        if (decl.prop.startsWith('--')) {
          scopeDefinedVaribles.add(decl.prop)
          if (decl.parent.selector === ':root' || decl.parent.selector === ':host') {
            fileDefinedVariables.add(decl.prop)
          }
        }

        if (seen.has(decl)) {
          return
        } else {
          seen.set(decl, true)
        }

        for (const [, variableName] of matchAll(decl.value, variableReferenceRegex)) {
          checkVariable(
            variableName,
            decl,
            new Set([...globalDefinedVariables, ...fileDefinedVariables, ...scopeDefinedVaribles]),
          )
        }
      })
    })
  }
})

const cwd = process.cwd()
const cache = new TapMap()

function getDefinedVariables(globs, log) {
  const cacheKey = JSON.stringify({globs, cwd})
  return cache.tap(cacheKey, () => {
    const definedVariables = new Set()

    const files = globby.sync(globs)
    log(`Scanning ${files.length} SCSS files for CSS variables`)
    for (const file of files) {
      log(`==========\nLooking for CSS variable definitions in ${file}`)
      const css = fs.readFileSync(file, 'utf-8')
      for (const [, variableName] of matchAll(css, variableDefinitionRegex)) {
        log(`${variableName} defined in ${file}`)
        definedVariables.add(variableName)
      }
      for (const [, variableName] of matchAll(css, colorModeVariableDefinitionRegex)) {
        log(`--color-${variableName} defined via color-variables in ${file}`)
        definedVariables.add(`--color-${variableName}`)
      }
    }

    return definedVariables
  })
}

function noop() {}

module.exports.ruleName = ruleName
module.exports.messages = messages
