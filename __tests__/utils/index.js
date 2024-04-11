import dedent from 'dedent'
import stylelint from 'stylelint'
import {join} from 'path'
import defaultConfig from '../..'
import {fileURLToPath} from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default {
  defaultConfig,
}

export function extendDefaultConfig(config) {
  return Object.assign(
    {
      extends: join(__dirname, '../..'),
    },
    config,
  )
}

export function lint(code, config = defaultConfig, options = {}) {
  return stylelint.lint(
    Object.assign(options, {
      code: `${dedent(code).trim()}\n`,
      config,
    }),
  )
}
