const stylelint = require('stylelint')
const {requirePrimerFile} = require('../src/primer')

const ruleName = 'primer/no-override'
const CLASS_PATTERN = /(\.[-\w]+)/
const CLASS_PATTERN_ALL = new RegExp(CLASS_PATTERN, 'g')

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  if (!enabled) {
    return noop
  }

  const {bundles = ['utilities']} = options

  const primerMeta = requirePrimerFile('dist/meta.json')
  const availableBundles = Object.keys(primerMeta.bundles)

  const immutableSelectors = new Map()
  const immutableClassSelectors = new Map()
  for (const bundle of bundles) {
    if (!availableBundles.includes(bundle)) {
      continue
    }
    const stats = requirePrimerFile(`dist/stats/${bundle}.json`)
    const selectors = stats.selectors.values.filter(selector => CLASS_PATTERN.test(selector))
    for (const selector of selectors) {
      immutableSelectors.set(selector, bundle)
      for (const classSelector of getClassSelectors(selector)) {
        immutableClassSelectors.set(classSelector, bundle)
      }
    }
  }

  const messages = stylelint.utils.ruleMessages(ruleName, {
    rejected: (rule, {selector, bundle}) => {
      const suffix = bundle ? ` (found in ${bundle})` : ''
      return selector
        ? `"${selector}" should not be overridden in "${rule.selector}"${suffix}.`
        : `"${rule.selector}" should not be overridden${suffix}.`
    }
  })

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

    const report = (rule, subject) =>
      stylelint.utils.report({
        message: messages.rejected(rule, subject),
        node: rule,
        result,
        ruleName
      })

    root.walkRules(rule => {
      const subject = {rule}
      if (immutableSelectors.has(rule.selector)) {
        subject.bundle = immutableSelectors.get(rule.selector)
        report(rule, subject)
      } else {
        for (const classSelector of getClassSelectors(rule.selector)) {
          if (immutableClassSelectors.has(classSelector)) {
            subject.bundle = immutableClassSelectors.get(classSelector)
            subject.selector = classSelector
            report(rule, subject)
          }
        }
      }
    })
  }
})

function getClassSelectors(selector) {
  const match = selector.match(CLASS_PATTERN_ALL)
  return match ? [...match] : []
}

function noop() {}
