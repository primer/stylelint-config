const {createVariableRule} = require('./lib/variable-rules')

module.exports = createVariableRule('primer/box-shadow', {
  'box shadow': {
    expects: 'a box-shadow variable',
    props: 'box-shadow',
    values: ['$box-shadow*', '$*-shadow', 'none'],
    singular: true
  }
})
