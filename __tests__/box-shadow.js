import plugin from '../plugins/box-shadow.js'

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
      code: '.x { box-shadow: var(--shadow-resting-medium); }',
      description: 'CSS > Accepts box shadow variables',
    },
  ],
  reject: [
    {
      code: '.x { box-shadow: 1px 2px 3px 4px #000000; }',
      unfixable: true,
      message: messages.rejected('1px 2px 3px 4px #000000'),
      line: 1,
      column: 18,
      endColumn: 41,
      description: 'CSS > Errors on value not in box-shadow list',
    },
    // Light mode shadow replacement
    {
      code: '.x { box-shadow: 0px 3px 6px 0px #424a531f; }',
      fixed: '.x { box-shadow: var(--shadow-resting-medium); }',
      message: messages.rejected('0px 3px 6px 0px #424a531f', {name: '--shadow-resting-medium'}),
      line: 1,
      column: 18,
      endColumn: 43,
      description: "CSS > Replaces '0px 3px 6px 0px #424a531f' with 'var(--shadow-resting-medium)'.",
    },
    // Dark mode shadow replacement
    {
      code: '.x { box-shadow: 0px 3px 6px 0px #010409cc; }',
      fixed: '.x { box-shadow: var(--shadow-resting-medium); }',
      message: messages.rejected('0px 3px 6px 0px #010409cc', {name: '--shadow-resting-medium'}),
      line: 1,
      column: 18,
      endColumn: 43,
      description: "CSS > Replaces '0px 3px 6px 0px #010409cc' with 'var(--shadow-resting-medium)'.",
    },
  ],
})
