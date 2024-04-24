import plugin from '../plugins/borders.js'

const plugins = [plugin]
const {
  ruleName,
  rule: {messages},
} = plugin

// General Tests
testRule({
  plugins,
  ruleName,
  config: [true, {}],
  fix: true,
  cache: false,
  accept: [
    {
      code: '.x { border: var(--borderWidth-thin) solid var(--borderColor-default); }',
      description: 'CSS > Accepts border shorthand with variables',
    },
  ],
  reject: [
    {
      code: '.x { padding-bottom: 1px; }',
      unfixable: true,
      message: messages.rejected('1px'),
      line: 1,
      column: 22,
      endColumn: 25,
      description: 'CSS > Errors on value not in spacer list',
    },
  ],
})
