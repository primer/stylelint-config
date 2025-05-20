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
      code: '.x { color: var(--fgColor-default, var(--color-fg-default)); }',
      description: 'CSS > Ignores fallback old colors',
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
    {
      code: '.x { border: var(--borderWidth-thin) solid; }',
      description: 'CSS > Ignores border without color value',
    },
    {
      code: '.x { border: var(--borderWidth-thin) solid transparent; }',
      description: 'CSS > Ignores border with ignored color value',
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
      code: '.x { color: rgba(0,0,0,0); }',
      unfixable: true,
      message: messages.rejected('rgba(0,0,0,0)', 'fg'),
      line: 1,
      column: 13,
      endColumn: 26,
      description: 'CSS > Errors when using a hex color variable for a fg prop',
    },
    {
      code: '.x { color: var(--bgColor-default); }',
      unfixable: true,
      message: messages.rejected('var(--bgColor-default)', 'fg'),
      line: 1,
      column: 17,
      endColumn: 34,
      description: 'CSS > Errors when using a bg color variable for a fg prop',
    },
    {
      code: '.x { color: var(--fgColor-blue); }',
      unfixable: true,
      message: messages.rejected('var(--fgColor-blue)', 'fg'),
      line: 1,
      column: 17,
      endColumn: 31,
      description: 'CSS > Errors when variable does not exist but includes "Color"',
    },
    {
      code: '.x { background-color: var(--fgColor-default); }',
      unfixable: true,
      message: messages.rejected('var(--fgColor-default)', 'bg'),
      line: 1,
      column: 28,
      endColumn: 45,
      description: 'CSS > Errors when using a fg color variable for a bg prop',
    },
    {
      code: '.x { background: var(--fgColor-default); }',
      unfixable: true,
      message: messages.rejected('var(--fgColor-default)', 'bg'),
      line: 1,
      column: 22,
      endColumn: 39,
      description: 'CSS > Errors when using a fg color variable for a bg prop',
    },
    {
      code: '.x { border: var(--borderWidth-thin) solid var(--fgColor-default); }',
      unfixable: true,
      message: messages.rejected('var(--fgColor-default)', 'border'),
      line: 1,
      column: 48,
      endColumn: 65,
      description: 'CSS > Errors when using a fg color variable for a border prop',
    },
    {
      code: '.x { border: var(--borderWidth-thin) solid #123; }',
      unfixable: true,
      message: messages.rejected('#123', 'border'),
      line: 1,
      column: 44,
      endColumn: 48,
      description: 'CSS > Errors when using a hex color variable for a border prop',
    },
    {
      code: '.x { background: center / contain no-repeat url("../../media/examples/firefox-logo.svg"), #eee 35% url("../../media/examples/lizard.png"); }',
      unfixable: true,
      message: messages.rejected('#eee', 'bg'),
      line: 1,
      column: 91,
      endColumn: 95,
      description: 'CSS > Errors when using a hex color variable for a background prop',
    },
    {
      code: '.x { color: var(--base-color-scale-purple-5); }',
      unfixable: true,
      message: messages.rejected('var(--base-color-scale-purple-5)', 'fg'),
      line: 1,
      column: 17,
      endColumn: 44,
      description: 'CSS > Errors when using a variable not in primitives',
    },
    {
      code: '.x { background: var(--display-blue-scale-1); }',
      unfixable: true,
      message: messages.rejected('var(--display-blue-scale-1)', 'bg'),
      line: 1,
      column: 22,
      endColumn: 44,
      description: 'CSS > Errors when using a dispaly scale variable',
    },
    {
      code: '.x { background-color: var(--display-blue-scale-1); }',
      unfixable: true,
      message: messages.rejected('var(--display-blue-scale-1)', 'bg'),
      line: 1,
      column: 28,
      endColumn: 50,
      description: 'CSS > Errors when using a dispaly scale variable',
    },
    {
      code: '.x { background-image: linear-gradient(var(--display-blue-scale-1), var(--bgColor-default)); }',
      unfixable: true,
      message: messages.rejected('var(--display-blue-scale-1)', 'bg'),
      line: 1,
      column: 44,
      endColumn: 66,
      description: 'CSS > Errors when using a dispaly scale variable',
    },
    {
      code: '.x { color: var(--display-blue-scale-1); }',
      unfixable: true,
      message: messages.rejected('var(--display-blue-scale-1)', 'fg'),
      line: 1,
      column: 17,
      endColumn: 39,
      description: 'CSS > Errors when using a dispaly scale variable',
    },
    {
      code: '.x { color: var(--display-blue-scale-1); }',
      unfixable: true,
      message: messages.rejected('var(--display-blue-scale-1)', 'fg'),
      line: 1,
      column: 17,
      endColumn: 39,
      description: 'CSS > Errors when using a dispaly scale variable',
    },
    {
      code: '.x { border-color: var(--display-blue-scale-9); }',
      unfixable: true,
      message: messages.rejected('var(--display-blue-scale-9)', 'border'),
      line: 1,
      column: 24,
      endColumn: 46,
      description: 'CSS > Errors when using a dispaly scale variable',
    },
  ],
})

// SCSS Specific Tests
testRule({
  plugins,
  ruleName,
  customSyntax: 'postcss-scss',
  codeFilename: 'example.scss',
  config: [true, {}],
  fix: true,
  cache: false,
  accept: [],
  reject: [
    {
      code: '.x { color: $static-color-white; }',
      unfixable: true,
      message: messages.rejected('$static-color-white', 'fg'),
      line: 1,
      column: 13,
      endColumn: 32,
      description: 'SCSS > Errors when using a sass variable',
    },
    {
      code: '.x { background-color: darken($static-color-blue-000, 4%); }',
      unfixable: true,
      message: messages.rejected('$static-color-blue-000', 'bg'),
      line: 1,
      column: 31,
      endColumn: 53,
      description: 'SCSS > Errors when using a sass variable',
    },
  ],
})
