const anymatch = require('anymatch')
const {createVariableRule} = require('./lib/variable-rules')

const spacerVarPatterns = ['$spacer-*', '$em-spacer-*']
const values = [...spacerVarPatterns, '0', 'auto', 'inherit']

module.exports = createVariableRule('primer/spacing', ({variables}) => {
  const spacerVars = Object.keys(variables).filter(anymatch(spacerVarPatterns))
  const negativeValues = spacerVarPatterns.map(p => `-${p}`)
  const replacements = {}
  for (const name of spacerVars) {
    replacements[`-${variables[name].computed}`] = `-${name}`
  }
  return {
    margin: {
      expects: 'a spacer variable',
      props: 'margin{,-top,-right,-bottom,-left}',
      values: values.concat(negativeValues),
      replacements
    },
    padding: {
      expects: 'a non-negative spacer variable',
      props: 'padding{,-top,-right,-bottom,-left}',
      values
    }
  }
})
