const dedent = require('dedent')
const stylelint = require('stylelint')
const {join} = require('path')
const defaultConfig = require('../..')

module.exports = {
  lint,
  defaultConfig,
  extendDefaultConfig
}

function extendDefaultConfig(config) {
  return Object.assign(
    {
      extends: join(__dirname, '../..')
    },
    config
  )
}

function lint(code, config = defaultConfig, options = {}) {
  return stylelint.lint(
    Object.assign(options, {
      code: `${dedent(code).trim()}\n`,
      config
    })
  )
}
