const {createVariableRule} = require('./lib/variable-rules')

const bgVars = ['$bg-*', '$tooltip-background-color']

module.exports = createVariableRule('primer/colors', {
  'background-color': {
    expects: 'a background color variable',
    values: bgVars.concat('none', 'transparent')
  },
  background: {
    expects: 'a background color variable',
    values: bgVars.concat('none', 'transparent', 'top', 'right', 'bottom', 'left', 'center', '*px', 'url(*)')
  },
  'text color': {
    expects: 'a text color variable',
    props: 'color',
    values: ['$text-*', '$tooltip-text-color', 'inherit'],
    replacements: {
      '#fff': '$text-white',
      white: '$text-white',
      '#000': '$text-gray-dark',
      black: '$black'
    }
  }
})
