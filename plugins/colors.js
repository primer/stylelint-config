const {createVariableRule} = require('./lib/variable-rules')

module.exports = createVariableRule('primer/colors', {
  'background color': {
    expects: 'a background color variable',
    props: ['background{,-color}'],
    values: ['$bg-*', 'transparent', 'none']
  },
  'text color': {
    expects: 'a text color variable',
    props: 'color',
    values: ['$text-*'],
    replacements: {
      '#fff': '$text-white',
      white: '$text-white',
      '#000': '$text-gray-dark',
      black: '$black'
    }
  }
})
