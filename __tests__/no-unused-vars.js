const {join} = require('path')
const stylelint = require('stylelint')

const fixture = (...path) => join(__dirname, '__fixtures__', ...path)
const ruleName = 'primer/no-unused-vars'
const pluginPath = require.resolve('../plugins/no-unused-vars')

describe('primer/no-unused-vars', () => {
  it('finds unused vars', () => {
    const config = {
      plugins: [pluginPath],
      rules: {
        [ruleName]: [true, {files: fixture('*.scss')}]
      }
    }
    return stylelint
      .lint({
        files: fixture('has-unused-vars.scss'),
        config
      })
      .then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarnings([`The variable "$unused" is not referenced. (${ruleName})`])
      })
  })

  it(`doesn't run when disabled`, () => {
    const config = {
      plugins: [pluginPath],
      rules: {
        [ruleName]: false
      }
    }
    return stylelint
      .lint({
        files: fixture('has-unused-vars.scss'),
        config
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })

  it(`talks a lot with {verbose: true}`, () => {
    const config = {
      plugins: [pluginPath],
      rules: {
        [ruleName]: [true, {files: fixture('*.scss'), verbose: true}]
      }
    }
    return stylelint
      .lint({
        files: fixture('*.scss'),
        config
      })
      .then(data => {
        expect(data).toHaveErrored()
        expect(data).toHaveWarnings([`The variable "$unused" is not referenced. (${ruleName})`])
      })
  })
})
