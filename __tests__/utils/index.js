import dedent from 'dedent'
import stylelint from 'stylelint'
import defaultConfig from '../../index.js'

export default {
  defaultConfig,
}

export function lint(code, config = defaultConfig, options = {}) {
  return stylelint.lint(
    Object.assign(options, {
      code: `${dedent(code).trim()}\n`,
      config,
    }),
  )
}
