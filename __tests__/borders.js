import plugin from '../plugins/borders.js'
import dedent from 'dedent'

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
    // Border widths
    {
      code: '.x { border: var(--borderWidth-thin) solid var(--borderColor-default); }',
      description: 'CSS > Accepts border shorthand with variables',
    },
    {
      code: '.x { border-width: var(--borderWidth-thin); }',
      description: 'CSS > Accepts border shorthand with variables',
    },
    {
      code: '.x { border-left-width: var(--borderWidth-thin); }',
      description: 'CSS > Accepts directional border longhand with variables',
    },
    {
      code: '.x { border-inline-start-width: var(--borderWidth-thin); }',
      description: 'CSS > Accepts logical properties directional border longhand with variables',
    },
    {
      code: '.x { border: 0; }',
      description: 'CSS > Allows zero values',
    },
    {
      code: '.x { border: inherit; border: initial; border: revert; border: revert-layer; border: unset; }',
      description: 'CSS > Allows global values',
    },
    // Border radii
    {
      code: '.x { border-radius: var(--borderRadius-medium); }',
      description: 'CSS > Accepts border-radius with variables',
    },
    {
      code: '.x { border-radius: var(--borderRadius-large) var(--borderRadius-small); }',
      description: 'CSS > Accepts border-radius shorthand with variables',
    },
    {
      code: '.x { border-bottom: var(--borderWidth-thin) solid var(--borderColor-muted); }',
      description: 'CSS > Accepts directional border-bottom',
    },
    {
      code: '.x { border: var(--borderWidth-thin) solid transparent; }',
      description: 'CSS > Accepts transparent colors',
    },
    {
      code: '.x { border-color: red; }',
      description: 'CSS > Ignores border-color prop',
    },
    // Figure out how to allow `calc()` values
  ],
  reject: [
    // Border widths
    {
      code: '.x { border: 20px; }',
      unfixable: true,
      message: messages.rejected('20px'),
      line: 1,
      column: 14,
      endColumn: 18,
      description: 'CSS > Errors on value not in border width list',
    },
    {
      code: '.x { border: $border-width $border-style var(--borderColor-attention-emphasis, var(--color-attention-emphasis)); }',
      unfixable: true,
      description: 'CSS > Errors on value not in border width list',
      warnings: [
        {
          message: messages.rejected('$border-width'),
          line: 1,
          column: 14,
          endColumn: 27,
          rule: 'primer/spacing',
          severity: 'error',
        },
        {
          message: messages.rejected('$border-style'),
          line: 1,
          column: 28,
          endColumn: 41,
          rule: 'primer/spacing',
          severity: 'error',
        },
      ],
    },
    {
      code: '.x { border: 1px; }',
      fixed: '.x { border: var(--borderWidth-thin); }',
      message: messages.rejected('1px', {name: '--borderWidth-thin'}),
      line: 1,
      column: 14,
      endColumn: 17,
      description: "CSS > Replaces '1px' with 'var(--borderWidth-thin)'.",
    },
    {
      code: '.x { border-width: var(--borderRadius-small); }',
      unfixable: true,
      message: messages.rejected('var(--borderRadius-small)', undefined, 'border-width'),
      line: 1,
      column: 24,
      endColumn: 44,
      description: 'CSS > Does not accept a border radius variable for border width.',
    },
    // Border radii
    {
      code: '.x { border-radius: 3px; }',
      fixed: '.x { border-radius: var(--borderRadius-small); }',
      message: messages.rejected('3px', {name: '--borderRadius-small'}),
      line: 1,
      column: 21,
      endColumn: 24,
      description: "CSS > Replaces '3px' with 'var(--borderRadius-small)'.",
    },
    {
      code: '.x { border-radius: 0.1875rem; }',
      fixed: '.x { border-radius: var(--borderRadius-small); }',
      message: messages.rejected('0.1875rem', {name: '--borderRadius-small'}),
      line: 1,
      column: 21,
      endColumn: 30,
      description: "CSS > Replaces '0.1875rem' with 'var(--borderRadius-small)'.",
    },
    {
      code: '.x { border-radius: var(--borderWidth-thin); }',
      unfixable: true,
      message: messages.rejected('var(--borderWidth-thin)', undefined, 'border-radius'),
      line: 1,
      column: 25,
      endColumn: 43,
      description: 'CSS > Does not accept a border width variable for border radius.',
    },
    {
      code: '.x { border-radius: 1px; }',
      unfixable: true,
      message: messages.rejected('1px', undefined, 'border-radius'),
      line: 1,
      column: 21,
      endColumn: 24,
      description: 'CSS > Does not autofix 1px to borderWidth-thin variable.',
    },
    {
      code: '.x { border: 1px solid var(--borderColor-default); }',
      fixed: '.x { border: var(--borderWidth-thin) solid var(--borderColor-default); }',
      message: messages.rejected('1px', {name: '--borderWidth-thin'}),
      line: 1,
      column: 14,
      endColumn: 17,
      description: 'CSS > Places error border on 1px for shorthand border.',
    },
  ],
})

// Styled Syntax Specific Tests
testRule({
  plugins,
  ruleName,
  customSyntax: 'postcss-styled-syntax',
  codeFilename: 'example.tsx',
  config: [true, {}],
  fix: true,
  cache: false,
  accept: [
    {
      code: dedent`
        export const IconContainer = styled(Box)\`
          border-radius: \${themeGet('radii.2')};
        \`
      `,
      description: 'TSX > Ignores themeGet.',
    },
  ],
})
