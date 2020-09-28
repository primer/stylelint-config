const {messages, ruleName} = require('../plugins/no-undefined-vars')

testRule({
  plugins: ['./plugins/no-undefined-vars.js'],
  ruleName,
  config: true,

  accept: [
    {
      code: '.x { color: var(--color-text-primary)}'
    }
  ],

  reject: [
    {
      code: '.x { color: var(--color-foo)}',
      message: messages.rejected('--color-foo'),
      line: 1,
      column: 6
    }
  ]
})
