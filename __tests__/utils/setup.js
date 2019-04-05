expect.extend({
  toHaveErrored(data) {
    return {
      pass: data.errored,
      message: () => `Expected "errored" === ${!data.errored}, but got ${data.errored}:
- ${data.results[0].warnings.map(warning => warning.text).join('\n- ')}`
    }
  },

  toHaveResultsLength(data, length) {
    return {
      pass: data.results.length === length,
      message: () => `Expected results.length === ${length}, but got ${data.results.length}`
    }
  },

  toHaveWarningsLength(data, length) {
    const {warnings} = data.results[0]
    return {
      pass: warnings.length === length,
      message: () => `Expected results[0].warnings.length === ${length}, but got ${warnings.length}:
- ${warnings.map(warning => warning.text).join('\n- ')}`
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
`
    }
  },

  toHaveDeprecationsLength(data, length) {
    const {deprecations} = data.results[0]
    return {
      pass: deprecations.length === length,
      message: () => `Expected ${length} deprecations, but got ${deprecations.length}`
    }
  }
})
