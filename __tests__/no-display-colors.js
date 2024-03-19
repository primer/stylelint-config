const path = require('path')
const {messages, ruleName} = require('../plugins/no-display-colors')

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/no-display-colors.js'],
  ruleName,
  config: [
    true,
    {
      files: [path.join(__dirname, '__fixtures__/color-vars.scss')],
    },
  ],

  accept: [{code: '.x { color: var(--fgColor-accent); }'}],

  reject: [
    {
      code: '.x { color: var(--display-blue-fgColor); }',
      message: messages.rejected('--display-blue-fgColor'),
      line: 1,
      column: 6,
    },
    {
      code: '.x { color: var(--display-yellow-bgColor-emphasis); }',
      message: messages.rejected('--display-yellow-bgColor-emphasis'),
      line: 1,
      column: 6,
    },
  ],
})
