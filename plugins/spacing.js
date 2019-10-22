const {createVariableRule, reverseAssignments} = require('./lib/variable-rules')

const SPACE_VALUES = ['$spacer-*', '-$spacer-*', '0', 'auto', 'inherit']
const SPACE_FIXES = reverseAssignments(`
  $spacer-1: 4px !default;
  $spacer-2: 8px !default;
  $spacer-3: 16px !default;
  $spacer-4: 24px !default;
  $spacer-5: 32px !default;
  $spacer-6: 40px !default;
`)

module.exports = createVariableRule('primer/spacing', {
  margin: {
    expects: 'a $spacer-* variable',
    props: 'margin{,-top,-right,-bottom,-left}',
    values: SPACE_VALUES,
    replacements: SPACE_FIXES
  },
  padding: {
    expects: 'a $spacer-* variable',
    props: 'padding{,-top,-right,-bottom,-left}',
    values: SPACE_VALUES,
    replacements: SPACE_FIXES
  }
})
