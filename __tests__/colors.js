import plugin from '../plugins/colors.js'

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
      code: '.x { color: var(--fgColor-default); }',
      description: 'CSS > Accepts foreground color variables',
    },
    {
      code: '.x { background-color: var(--bgColor-default); }',
      description: 'CSS > Accepts background color variables',
    },
    {
      code: '.x { border-color: var(--borderColor-default); }',
      description: 'CSS > Accepts border color variables',
    },
    {
      code: '.x { fill: var(--fgColor-default); }',
      description: 'CSS > Accepts fill fg color variables',
    },
    {
      code: '.x { fill: var(--bgColor-default); }',
      description: 'CSS > Accepts fill bg color variables',
    },
    {
      code: '.x { stroke: var(--borderColor-default); }',
      description: 'CSS > Accepts border color variables',
    },
    {
      code: '.x { stroke: var(--fgColor-default); }',
      description: 'CSS > Accepts fg color variables',
    },
    {
      code: '.x { background: var(--bgColor-default); }',
      description: 'CSS > Accepts bg color variables',
    },
    {
      code: '.x { border: 1px solid var(--borderColor-default); }',
      description: 'CSS > Accepts border color variables',
    },
    {
      code: '.x { border-top-left: 1px solid var(--borderColor-default); }',
      description: 'CSS > Accepts border color variables',
    },
    {
      code: '.x { border-top-left-color: var(--borderColor-default); }',
      description: 'CSS > Accepts border color variables',
    },
    {
      code: '.x { border-top-left-width: 1px; }',
      description: 'CSS > Ignores border width variables',
    },
    {
      code: '.x { border: none; }',
      description: 'CSS > Ignores border none',
    },
    {
      code: '.x { background-color: currentcolor; }',
      description: 'CSS > Ignores background-color currentcolor',
    },
    {
      code: '.x { background-color: inherit; }',
      description: 'CSS > Ignores background-color inherit',
    },
    {
      code: '.x { background-color: initial; }',
      description: 'CSS > Ignores background-color initial',
    },
    {
      code: '.x { background-color: revert; }',
      description: 'CSS > Ignores background-color revert',
    },
    {
      code: '.x { background-color: revert-layer; }',
      description: 'CSS > Ignores background-color revert-layer',
    },
    {
      code: '.x { background-color: unset; }',
      description: 'CSS > Ignores background-color unset',
    },
    {
      code: '.x { background-color: transparent; }',
      description: 'CSS > Ignores background-color transparent',
    },
  ],
  reject: [
    {
      code: '.x { color: #123; }',
      unfixable: true,
      message: messages.rejected('#123', 'fg'),
      line: 1,
      column: 13,
      endColumn: 17,
      description: 'CSS > Errors when using a hex color variable for a fg prop',
    },
    {
      code: '.x { color: var(--bgColor-default); }',
      unfixable: true,
      message: messages.rejected('var(--bgColor-default)', 'fg'),
      line: 1,
      column: 13,
      endColumn: 35,
      description: 'CSS > Errors when using a bg color variable for a fg prop',
    },
    {
      code: '.x { background-color: var(--fgColor-default); }',
      unfixable: true,
      message: messages.rejected('var(--fgColor-default)', 'bg'),
      line: 1,
      column: 24,
      endColumn: 46,
      description: 'CSS > Errors when using a fg color variable for a bg prop',
    },
    {
      code: '.x { background: var(--fgColor-default); }',
      unfixable: true,
      message: messages.rejected('var(--fgColor-default)', 'bg'),
      line: 1,
      column: 18,
      endColumn: 40,
      description: 'CSS > Errors when using a fg color variable for a bg prop',
    },
    {
      code: '.x { border: var(--borderWidth-thin) solid var(--fgColor-default); }',
      unfixable: true,
      message: messages.rejected('var(--fgColor-default)', 'border'),
      line: 1,
      column: 24,
      endColumn: 46,
      description: 'CSS > Errors when using a fg color variable for a border prop',
    },
  ],
})
