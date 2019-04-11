const stylelint = require('stylelint')
const {requirePrimerFile} = require('../src/primer')

const ruleName = 'primer/no-override'
const CLASS_PATTERN = /(\.[-\w]+)/g

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: selector => `The selector "${selector}" should not be overridden.`
})

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  if (!enabled) {
    return noop
  }

  const {bundles = ['utilities']} = options

  const primerMeta = requirePrimerFile('dist/meta.json')
  const availableBundles = Object.keys(primerMeta.bundles)

  const immutableSelectors = new Set()
  const immutableClassSelectors = new Set()
  for (const bundle of bundles) {
    if (!availableBundles.includes(bundle)) {
      continue
    }
    const stats = requirePrimerFile(`dist/stats/${bundle}.json`)
    for (const selector of stats.selectors.values) {
      immutableSelectors.add(selector)
      for (const classSelector of getClassSelectors(selector)) {
        immutableClassSelectors.add(classSelector)
      }
    }
  }

  // console.warn(`Got ${immutableSelectors.size} immutable selectors from: "${bundles.join('", "')}"`)

  return (root, result) => {
    if (!Array.isArray(bundles) || bundles.some(bundle => !availableBundles.includes(bundle))) {
      const invalidBundles = Array.isArray(bundles)
        ? `"${bundles.filter(bundle => !availableBundles.includes(bundle)).join('", "')}"`
        : '(not an array)'
      result.warn(`The "bundles" option must be an array of valid bundles; got: ${invalidBundles}`, {
        stylelintType: 'invalidOption',
        stylelintReference: 'https://github.com/primer/stylelint-config-primer#options'
      })
    }

    if (!enabled) {
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

function noop() {}
