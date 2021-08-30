const {messages, ruleName} = require('../plugins/no-deprecated-colors')

testRule({
  plugins: ['./plugins/no-deprecated-colors.js'],
  ruleName,
  config: [true],
  fix: true,
  accept: [{code: '.x { color: var(--color-fg-default, var(--color-text-primary)); }'}],
  reject: [
    {
      code: '.x { border: 1px solid var(--color-text-primary); }',
      fixed: '.x { border: 1px solid var(--color-fg-default); }',
      message: messages.rejected('--color-text-primary'),
      line: 1,
      column: 6
    }
  ]
})
