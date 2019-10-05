const {createVariableRule, reverseAssignments} = require('./lib/variable-rules')

module.exports = createVariableRule('primer/box-shadow', {
  'box shadow': {
    props: 'box-shadow',
    values: ['$box-shadow*', '0', 'none'],
    replacements: {
      '0 1px 1px rgba($black, 0.1)': '$box-shadow',
      '0 1px 5px $black-fade-15': '$box-shadow-medium',
      '0 1px 15px $black-fade-15': '$box-shadow-large',
      '0 10px 50px rgba($black, 0.07)': '$box-shadow-extra-large'
    }
  },
})
