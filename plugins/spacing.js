const {createVariableRule, reverseAssignments} = require('./lib/variable-rules')

const SPACE_VALUES = ['$spacer-*', '-$spacer-*', '0', 'auto', 'inherit']
const SPACE_FIXES = {
  '4px': '$spacer-1',
  '8px': '$spacer-2',
  '16px': '$spacer-3'
}

module.exports = createVariableRule('primer/spacing', {
  margin: {
    props: 'margin{,-top,-right,-bottom,-left}',
    values: SPACE_VALUES,
    replacements: SPACE_FIXES
  },
  padding: {
    props: 'padding{,-top,-right,-bottom,-left}',
    values: SPACE_VALUES,
    replacements: SPACE_FIXES
  }
})
