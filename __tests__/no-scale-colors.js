const path = require('path')
const {messages, ruleName} = require('../plugins/no-scale-colors')

testRule({
  plugins: ['./plugins/no-scale-colors.js'],
  ruleName,
  config: [
    true,
    {
      files: [path.join(__dirname, '__fixtures__/color-vars.scss')]
    }
  ],

  accept: [
    {code: '.x { color: var(--color-text-primary); }'},
    {code: '@include color-variables(((my-feature, (light: var(--color-scale-blue-1), dark: var(--color-scale-blue-5)))));'}
  ],

  reject: [
    {
      code: '.x { color: var(--color-scale-blue-1); }',
      message: messages.rejected('--color-scale-blue-1'),
      line: 1,
      column: 6
    },
    {
      code: '.x { color: var(--color-auto-blue-1); }',
      message: messages.rejected('--color-auto-blue-1'),
      line: 1,
      column: 6
    }
  ]
})
