const stylelint = require('stylelint')

const ruleName = 'primer/no-override'
const CLASS_PATTERN = /(\.[-\w]+)/g

let primerMeta = {}
let availableBundles = []
try {
  primerMeta = require('@primer/css/dist/meta.json')
} catch (error) {
  throw new Error(
    `[${ruleName}] Unable to require('@primer/css/dist/meta.json')! Did you install it as a peerDependency?`
  )
}

availableBundles = Object.keys(primerMeta.bundles)

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: selector => `The selector "${selector}" should not be overridden.`
})

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  const {bundles = ['utilities']} = options

  const immutableSelectors = new Set()
  const immutableClassSelectors = new Set()
  for (const bundle of bundles) {
    if (!availableBundles.includes(bundle)) {
      throw new Error(`Unknown @primer/css bundle: "${bundle}"!`)
    }
    const {cssstats} = require(`@primer/css/dist/${bundle}`)
    for (const selector of cssstats.selectors.values) {
      immutableSelectors.add(selector)
      for (const classSelector of getClassSelectors(selector)) {
        immutableClassSelectors.add(classSelector)
      }
    }
  }

  // console.warn(`Got ${immutableSelectors.size} immutable selectors from: "${bundles.join('", "')}"`)

  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: enabled,
      possible: [true, false]
    })

    if (!validOptions) {
      return
    }

    const report = (rule, selector) =>
      stylelint.utils.report({
        message: messages.rejected(selector),
        node: rule,
        result,
        ruleName
      })

    root.walkRules(rule => {
      if (immutableSelectors.has(rule.selector)) {
        report(rule, rule.selector)
      } else {
        for (const classSelector of getClassSelectors(rule.selector)) {
          if (immutableClassSelectors.has(classSelector)) {
            report(rule, classSelector)
          }
        }
      }
    })
  }
})

function getClassSelectors(selector) {
  const match = selector.match(CLASS_PATTERN)
  return match ? [...match] : []
}
