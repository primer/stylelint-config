import plugin from '../plugins/typography.js'

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
    // Font sizes
    {
      code: '.x { font-size: var(--text-title-size-medium); }',
      description: 'CSS > Accepts font size variables',
    },
    // Font weights
    {
      code: '.x { font-weight: var(--base-text-weight-semibold); }',
      description: 'CSS > Accepts base font weight variables',
    },
    {
      code: '.x { font-weight: var(--text-title-weight-medium); }',
      description: 'CSS > Accepts functional font weight variables',
    },
    // Line heights
    {
      code: '.x { line-height: var(--text-title-lineHeight-medium); }',
      description: 'CSS > Accepts line height variables',
    },
    // Font family
    {
      code: '.x { font-family: var(--fontStack-system); }',
      description: 'CSS > Accepts font stack variables',
    },
    // Font shorthand
    {
      code: '.x { font: var(--text-display-shorthand); }',
      description: 'CSS > Accepts font shorthand variables',
    },
    {
      code: '.x { font-style: italic; }',
      description: 'CSS > Ignores font-style property',
    },
  ],
  reject: [
    // Font sizes
    {
      code: '.x { font-size: 42px; }',
      unfixable: true,
      message: messages.rejected('42px'),
      line: 1,
      column: 17,
      endColumn: 21,
      description: 'CSS > Errors on value not in font size list',
    },
    {
      code: '.x { font-size: 40px; }',
      fixed: '.x { font-size: var(--base-text-size-2xl); }',
      message: messages.rejected('40px', {name: '--base-text-size-2xl'}),
      line: 1,
      column: 17,
      endColumn: 21,
      description: "CSS > Replaces '40px' with 'var(--base-text-size-2xl)'.",
    },
    {
      code: '.x { font-size: 2.5rem; }',
      unfixable: true,
      message: messages.rejected('2.5rem'),
      line: 1,
      column: 17,
      endColumn: 23,
      description: "CSS > Errors on '2.5rem' (no exact match in primitives).",
    },
    // Font weights
    {
      code: '.x { font-weight: 500; }',
      fixed: '.x { font-weight: var(--base-text-weight-medium); }',
      message: messages.rejected('500', {name: '--base-text-weight-medium'}),
      line: 1,
      column: 19,
      endColumn: 22,
      description: "CSS > Errors on font-weight of 500 and suggests '--base-text-weight-medium'.",
    },
    {
      code: '.x { font-weight: 100; }',
      fixed: '.x { font-weight: var(--base-text-weight-light); }',
      message: messages.rejected('100', {name: '--base-text-weight-light'}),
      line: 1,
      column: 19,
      endColumn: 22,
      description: "CSS > Replaces font-weight less than 300 with 'var(--base-text-weight-light)'.",
    },
    {
      code: '.x { font-weight: 800; }',
      fixed: '.x { font-weight: var(--base-text-weight-semibold); }',
      message: messages.rejected('800', {name: '--base-text-weight-semibold'}),
      line: 1,
      column: 19,
      endColumn: 22,
      description: "CSS > Errors on font-weight greater than 600 and suggests '--base-text-weight-semibold'.",
    },
    {
      code: '.x { font-weight: lighter; }',
      fixed: '.x { font-weight: var(--base-text-weight-light); }',
      message: messages.rejected('lighter', {name: '--base-text-weight-light'}),
      line: 1,
      column: 19,
      endColumn: 26,
      description: "CSS > Replaces 'lighter' font-weight keyword with 'var(--base-text-weight-light)'.",
    },
    {
      code: '.x { font-weight: bold; }',
      fixed: '.x { font-weight: var(--base-text-weight-semibold); }',
      message: messages.rejected('bold', {name: '--base-text-weight-semibold'}),
      line: 1,
      column: 19,
      endColumn: 23,
      description: "CSS > Errors on 'bold' font-weight keyword and suggests '--base-text-weight-semibold'.",
    },
    {
      code: '.x { font-weight: bolder; }',
      fixed: '.x { font-weight: var(--base-text-weight-semibold); }',
      message: messages.rejected('bolder', {name: '--base-text-weight-semibold'}),
      line: 1,
      column: 19,
      endColumn: 25,
      description: "CSS > Errors on 'bolder' font-weight keyword and suggests '--base-text-weight-semibold'.",
    },
    {
      code: '.x { font-weight: normal; }',
      fixed: '.x { font-weight: var(--base-text-weight-normal); }',
      message: messages.rejected('normal', {name: '--base-text-weight-normal'}),
      line: 1,
      column: 19,
      endColumn: 25,
      description: "CSS > Errors on 'normal' font-weight keyword and suggests '--base-text-weight-normal'.",
    },
    // Line heights
    {
      code: '.x { line-height: 42px; }',
      unfixable: true,
      message: messages.rejected('42px'),
      line: 1,
      column: 19,
      endColumn: 23,
      description: 'CSS > Errors on value not in line height list',
    },
    {
      code: '.x { line-height: 1.4; }',
      unfixable: true,
      message: messages.rejected('1.4'),
      line: 1,
      column: 19,
      endColumn: 22,
      description: "CSS > Errors on '1.4' line-height (no exact match in primitives).",
    },
    {
      code: '.x { line-height: 1.5; }',
      fixed: '.x { line-height: var(--base-text-lineHeight-normal); }',
      message: messages.rejected('1.5', {name: '--base-text-lineHeight-normal'}),
      line: 1,
      column: 19,
      endColumn: 22,
      description: "CSS > Errors on '1.5' line-height and suggests '--base-text-lineHeight-normal'.",
    },
    // Font family
    {
      code: '.x { font-family: Comic Sans; }',
      unfixable: true,
      message: messages.rejected('Comic Sans'),
      line: 1,
      column: 19,
      endColumn: 29,
      description: 'CSS > Errors on value not in font family list',
    },
    // Font shorthand
    {
      code: '.x { font: bold 24px/1 sans-serif; }',
      unfixable: true,
      message: messages.rejected('bold 24px/1 sans-serif'),
      line: 1,
      column: 12,
      endColumn: 34,
      description: 'CSS > Errors on hard-coded value not in font shorthand list',
    },
  ],
})
