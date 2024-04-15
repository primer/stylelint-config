import stylelint from 'stylelint'
import primerUtilitiesJson from '@primer/css/dist/stats/utilities.json' assert {type: 'json'}

const ruleName = 'primer/no-override'
const CLASS_PATTERN = /(\.[-\w]+)/
const CLASS_PATTERN_ALL = new RegExp(CLASS_PATTERN, 'g')
const CLASS_PATTERN_ONLY = /^\.[-\w]+(:{1,2}[-\w]+)?$/

export default stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  if (!enabled) {
    return noop
  }

  const {ignoreSelectors = []} = options

  const isSelectorIgnored =
    typeof ignoreSelectors === 'function'
      ? ignoreSelectors
      : selector => {
          return ignoreSelectors.some(pattern => {
            return pattern instanceof RegExp ? pattern.test(selector) : selector.includes(pattern)
          })
        }

  // These map selectors to the bundle in which they're defined.
  // If there's no entry for a given selector, it means that it's not defined
  // in one of the *specified* bundles, since we're iterating over the list of
  // bundle names in the options.
  const immutableSelectors = new Map()
  const immutableClassSelectors = new Map()

  const selectors = primerUtilitiesJson.selectors.values
  for (const selector of selectors) {
    immutableSelectors.set(selector, 'utilities')
    for (const classSelector of getClassSelectors(selector)) {
      immutableClassSelectors.set(classSelector, 'utilities')
    }
  }

  const messages = stylelint.utils.ruleMessages(ruleName, {
    rejected: ({rule, selector}) => {
      const definedIn = ` (defined in @primer/css/utilities)`
      const ruleSelector = collapseWhitespace(rule.selector)
      const context = selector === rule.selector ? '' : ` in "${ruleSelector}"`
      return `"${collapseWhitespace(selector)}" should not be overridden${context}${definedIn}.`
    },
  })

  return (root, result) => {
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
