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
    {
      code: '.x { padding-bottom: 0.25rem; }',
      fixed: '.x { padding-bottom: var(--base-size-4); }',
      message: messages.rejected('0.25rem', {name: '--base-size-4'}),
      line: 1,
      column: 22,
      endColumn: 29,
      description: "CSS > Replaces '0.25rem' with 'var(--base-size-4)'.",
    },
  ],
})
