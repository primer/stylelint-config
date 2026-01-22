import stylelint from 'stylelint'

const {
  createPlugin,
  utils: {report, ruleMessages, validateOptions},
} = stylelint

export const ruleName = 'primer/namespace-spacing'
export const messages = ruleMessages(ruleName, {
  rejected: className => {
    return `Class "${className}" must be namespaced with "pr-" prefix. Use "pr-${className}" instead.`
  },
})

// Utility class patterns that require namespacing
// Matches patterns like .m-*, .p-*, .mt-*, .mb-*, .ml-*, .mr-*, .mx-*, .my-*
// .pt-*, .pb-*, .pl-*, .pr-*, .px-*, .py-*
const UTILITY_PATTERNS = [
  /^m-\d+$/, // .m-0, .m-1, .m-2, etc.
  /^mt-\d+$/, // .mt-0, .mt-1, etc.
  /^mr-\d+$/, // .mr-0, .mr-1, etc.
  /^mb-\d+$/, // .mb-0, .mb-1, etc.
  /^ml-\d+$/, // .ml-0, .ml-1, etc.
  /^mx-\d+$/, // .mx-0, .mx-1, etc.
  /^my-\d+$/, // .my-0, .my-1, etc.
  /^p-\d+$/, // .p-0, .p-1, .p-2, etc.
  /^pt-\d+$/, // .pt-0, .pt-1, etc.
  /^pr-\d+$/, // .pr-0, .pr-1, etc. (note: this is directional padding-right, not prefix)
  /^pb-\d+$/, // .pb-0, .pb-1, etc.
  /^pl-\d+$/, // .pl-0, .pl-1, etc.
  /^px-\d+$/, // .px-0, .px-1, etc.
  /^py-\d+$/, // .py-0, .py-1, etc.
]

// Check if a class name matches any utility pattern
function isUnamespacedUtilityClass(className) {
  // Check if it matches any utility pattern first
  const matchesUtilityPattern = UTILITY_PATTERNS.some(pattern => pattern.test(className))

  if (!matchesUtilityPattern) {
    return false
  }

  // If it matches a utility pattern, check if it has the proper pr- namespace
  // We need to check for pr-m-, pr-p-, pr-mt-, etc. patterns, not just pr-
  // because pr-4 itself is a utility class (padding-right)
  const hasProperNamespace = /^pr-(m|p|mt|mr|mb|ml|mx|my|pt|pr|pb|pl|px|py)-\d+$/.test(className)

  // Return true if it matches a utility pattern but doesn't have proper namespace
  return !hasProperNamespace
}

/** @type {import('stylelint').Rule} */
const ruleFunction = primary => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    })

    if (!validOptions) return

    root.walkRules(rule => {
      // Parse the selector to extract class names
      const {selector} = rule

      // Match all class selectors in the rule
      // This regex matches .classname patterns
      const classMatches = selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)

      for (const match of classMatches) {
        const fullMatch = match[0] // Full match including the dot
        const className = match[1] // Class name without the dot
        const classStartIndex = match.index

        if (isUnamespacedUtilityClass(className)) {
          report({
            message: messages.rejected(className),
            node: rule,
            index: classStartIndex,
            endIndex: classStartIndex + fullMatch.length,
            result,
            ruleName,
          })
        }
      }
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages

export default createPlugin(ruleName, ruleFunction)
