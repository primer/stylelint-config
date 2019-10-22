const {createVariableRule} = require('./lib/variable-rules')

module.exports = createVariableRule('primer/typography', {
  'font-size': {
    expects: 'a font-size variable',
    values: ['$h{00,0,1,2,3,4,5,6}-size', '$font-size-*', '1', '1em', 'inherit']
  },
  'font-weight': {
    props: 'font-weight',
    values: ['$font-weight-*', 'inherit'],
    replacements: {
      bold: '$font-weight-bold',
      normal: '$font-weight-normal'
    }
  },
  'line-height': {
    props: 'line-height',
    values: ['$lh-*', '0', '1', '1em', 'inherit']
  }
})