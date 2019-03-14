const stylelint = require('stylelint')

const ruleName = 'primer/no-override'
const CLASS_PATTERN = /(\.[-\w]+)/g

let availableBundles = []
try {
  const meta = require('@primer/css/dist/meta.json')
  availableBundles = Object.keys(meta.bundles)
} catch (error) {
  throw new Error(
    `[${ruleName}] Unable to require('@primer/css/dist/meta.json')! Did you install it as a peerDependency?`
  )
}

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: selector => `Avoid styling the utility class selector "${selector}"`
})

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  const {bundles = ['utilities']} = options

  const utilitySelectors = new Set()
  for (const bundle of bundles) {
    if (!availableBundles.includes(bundle)) {
      throw new Error(`Unknown @primer/css bundle: "${bundle}"!`)
    }
    const {cssstats} = require(`@primer/css/dist/${bundle}`)
    for (const selector of cssstats.selectors.values) {
      for (const classSelector of getClassSelectors(selector)) {
        utilitySelectors.add(classSelector)
      }
    }
  }

  // console.warn(`Got ${utilitySelectors.size} utility selectors from: "${bundles.join('", "')}"`)

  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: enabled,
      possible: [true, false]
    })

    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      for (const classSelector of getClassSelectors(rule.selector)) {
        if (utilitySelectors.has(classSelector)) {
          stylelint.utils.report({
            message: messages.rejected(classSelector),
            node: rule,
            result,
            ruleName
          })
        }
      }
    })
  }
})

module.exports.ruleName = ruleName
module.exports.messages = messages

function getClassSelectors(selector) {
  const match = selector.match(CLASS_PATTERN)
  return match ? [...match] : []
}
