const stylelint = require('stylelint')
const {requirePrimerFile} = require('./lib/primer')

const ruleName = 'primer/no-override'
const CLASS_PATTERN = /(\.[-\w]+)/
const CLASS_PATTERN_ALL = new RegExp(CLASS_PATTERN, 'g')
const CLASS_PATTERN_ONLY = /^\.[-\w]+(:{1,2}[-\w]+)?$/

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  if (!enabled) {
    return noop
  }

  const {bundles = ['utilities'], ignoreSelectors = []} = options

  const isSelectorIgnored =
    typeof ignoreSelectors === 'function'
      ? ignoreSelectors
      : selector => {
          return ignoreSelectors.some(pattern => {
            return pattern instanceof RegExp ? pattern.test(selector) : selector.includes(pattern)
          })
        }

  const primerMeta = requirePrimerFile('dist/meta.json')
  const availableBundles = Object.keys(primerMeta.bundles)

  // These map selectors to the bundle in which they're defined.
  // If there's no entry for a given selector, it means that it's not defined
  // in one of the *specified* bundles, since we're iterating over the list of
  // bundle names in the options.
  const immutableSelectors = new Map()
  const immutableClassSelectors = new Map()

  for (const bundle of bundles) {
    if (!availableBundles.includes(bundle)) {
      continue
    }
    const stats = requirePrimerFile(`dist/stats/${bundle}.json`)
    const selectors = stats.selectors.values
    for (const selector of selectors) {
      immutableSelectors.set(selector, bundle)
      for (const classSelector of getClassSelectors(selector)) {
        immutableClassSelectors.set(classSelector, bundle)
      }
    }
  }

  const messages = stylelint.utils.ruleMessages(ruleName, {
    rejected: ({rule, selector, bundle}) => {
      const definedIn = ` (defined in @primer/css/${bundle})`
      const ruleSelector = collapseWhitespace(rule.selector)
      const context = selector === rule.selector ? '' : ` in "${ruleSelector}"`
      return `"${collapseWhitespace(selector)}" should not be overridden${context}${definedIn}.`
    },
  })

  return (root, result) => {
    if (!Array.isArray(bundles) || bundles.some(bundle => !availableBundles.includes(bundle))) {
      const invalidBundles = Array.isArray(bundles)
        ? `"${bundles.filter(bundle => !availableBundles.includes(bundle)).join('", "')}"`
        : '(not an array)'
      result.warn(`The "bundles" option must be an array of valid bundles; got: ${invalidBundles}`, {
        stylelintType: 'invalidOption',
        stylelintReference: 'https://github.com/primer/stylelint-config#options',
      })
    }

    const report = subject =>
      stylelint.utils.report({
        message: messages.rejected(subject),
        node: subject.rule,
        result,
        ruleName,
      })

    root.walkRules(rule => {
      const {selector} = rule
      if (immutableSelectors.has(selector)) {
        if (isClassSelector(selector)) {
          if (!isSelectorIgnored(selector)) {
            return report({
              rule,
              bundle: immutableSelectors.get(selector),
              selector,
            })
          }
        } else {
          // console.log(`not a class selector: "${selector}"`)
        }
      }
      for (const classSelector of getClassSelectors(selector)) {
        if (immutableClassSelectors.has(classSelector)) {
          if (!isSelectorIgnored(classSelector)) {
            return report({
              rule,
              bundle: immutableClassSelectors.get(classSelector),
              selector: classSelector,
            })
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

function isClassSelector(selector) {
  return CLASS_PATTERN_ONLY.test(selector)
}

function collapseWhitespace(str) {
  return str.trim().replace(/\s+/g, ' ')
}

function noop() {}
