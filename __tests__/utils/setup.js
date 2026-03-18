import {jest} from '@jest/globals'
import stylelint from 'stylelint'

// Stylelint 17 is ESM-only. CJS plugins (e.g. stylelint-browser-compat) that call
// require('stylelint') would cause Jest to throw ERR_REQUIRE_ESM. jest.mock intercepts
// the CJS require() path (checked before the ESM guard) and returns the real stylelint
// instance loaded via this file's static ESM import.
jest.mock('stylelint', () => ({__esModule: true, default: stylelint, ...stylelint}))

expect.extend({
  toHaveErrored(data) {
    return {
      pass: data.errored,
      message: () => `Expected "errored" === ${!data.errored}, but got ${data.errored}:
- ${data.results[0].warnings.map(warning => warning.text).join('\n- ')}`,
    }
  },

  toHaveResultsLength(data, length) {
    return {
      pass: data.results.length === length,
      message: () => `Expected results.length === ${length}, but got ${data.results.length}`,
    }
  },

  toHaveWarningsLength(data, length) {
    const {warnings} = data.results[0]
    return {
      pass: warnings.length === length,
      message: () => `Expected results[0].warnings.length === ${length}, but got ${warnings.length}:
- ${warnings.map(warning => warning.text).join('\n- ')}`,
    }
  },

  toHaveWarnings(data, warningTexts) {
    const trimmedWarnings = new Set(data.results[0].warnings.map(({text}) => text.trim()))
    return {
      pass: warningTexts.every(text => trimmedWarnings.has(text)),
      message: () => `Expected to find the following warnings:
- ${warningTexts.filter(text => !trimmedWarnings.has(text)).join('\n- ')}

But got instead:
- ${data.results[0].warnings.map(warning => warning.text).join('\n- ')}
`,
    }
  },

  toHaveDeprecationsLength(data, length) {
    const {deprecations} = data.results[0]
    return {
      pass: deprecations.length === length,
      message: () => `Expected ${length} deprecations, but got ${deprecations.length}`,
    }
  },
})
