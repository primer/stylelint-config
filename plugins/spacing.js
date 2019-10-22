const {createVariableRule} = require('./lib/variable-rules')

const SPACE_VALUES = ['$spacer-*', '-$spacer-*', '0', 'auto', 'inherit']

module.exports = createVariableRule('primer/spacing', {
  margin: {
    expects: 'a $spacer-* variable',
    props: 'margin{,-top,-right,-bottom,-left}',
    values: SPACE_VALUES
  },
  padding: {
    expects: 'a $spacer-* variable',
    props: 'padding{,-top,-right,-bottom,-left}',
    values: SPACE_VALUES
  }
})
