const path = require('path')
const {messages, ruleName} = require('../plugins/no-undefined-vars')

testRule({
  plugins: ['./plugins/no-undefined-vars.js'],
  ruleName,
  config: [
    true,
    {
      files: [
        path.join(__dirname, '__fixtures__/color-vars.scss'),
        path.join(__dirname, '__fixtures__/spacing-vars.scss')
      ]
    }
  ],

  accept: [
    {code: '.x { color: var(--color-text-primary); }'},
    {code: '.x { background-color: var(--color-counter-bg); }'},
    {code: '.x { margin: var(--spacing-spacer-1); }'}
  ],

  reject: [
    {
      code: '.x { color: var(--color-foo); }',
      message: messages.rejected('--color-foo'),
      line: 1,
      column: 6
    }
  ]
})
