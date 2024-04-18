import plugin from '../plugins/spacing.js'
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
    {
      code: '.x { padding: var(--base-size-4); }',
      description: 'CSS > One variable is valid.',
    },
    {
      code: '.x { padding-bottom: var(--base-size-4); }',
      description: 'CSS > Works on property partial match.',
    },
    {
      code: '.x { padding: var(--base-size-4) var(--base-size-8); }',
      description: 'CSS > Two variables are valid.',
    },
    {
      code: '.x { padding: 0 0; }',
      description: 'CSS > Ignore zero values.',
    },
    {
      code: '.x { margin: auto; }',
      description: 'CSS > Ignore auto values.',
    },
    {
      code: '.x { top: 100%; bottom: 100vh; }',
      description: 'CSS > Ignore top with non-spacer units.',
    },
    {
      code: '.x { border-top-width: 4px; }',
      description: 'CSS > Ignores values with top in name.',
    },
    {
      code: '.x { padding: calc(var(--base-size-4) * 2); }',
      description: 'CSS > Finds variable calc values.',
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
    {
      code: '.x { padding: 4px; }',
      fixed: '.x { padding: var(--base-size-4); }',
      message: messages.rejected('4px', {name: '--base-size-4'}),
      line: 1,
      column: 15,
      endColumn: 18,
      description: "CSS > Replaces '4px' with '--base-size-4'.",
    },
    {
      code: '.x { padding: 3px; margin: 5px; }',
      fixed: '.x { padding: var(--base-size-4); margin: var(--base-size-4); }',
      description: "CSS > Replaces +- pixel values with closest variable '--base-size-4'.",
      warnings: [
        {
          message: messages.rejected('3px', {name: '--base-size-4'}),
          line: 1,
          column: 15,
          endColumn: 18,
          rule: 'primer/spacing',
          severity: 'error',
        },
        {
          message: messages.rejected('5px', {name: '--base-size-4'}),
          line: 1,
          column: 28,
          endColumn: 31,
          rule: 'primer/spacing',
          severity: 'error',
        },
      ],
    },
    {
      code: '.x { padding: 4px; margin: 4px; top: 4px; right: 4px; bottom: 4px; left: 4px; }',
      fixed:
        '.x { padding: var(--base-size-4); margin: var(--base-size-4); top: var(--base-size-4); right: var(--base-size-4); bottom: var(--base-size-4); left: var(--base-size-4); }',
      description: "CSS > Replaces '4px' with '--base-size-4' for all properties supported.",
      warnings: [
        {
          endColumn: 18,
          column: 15,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('4px', {name: '--base-size-4'}),
        },
        {
          endColumn: 31,
          column: 28,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('4px', {name: '--base-size-4'}),
        },
        {
          endColumn: 41,
          column: 38,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('4px', {name: '--base-size-4'}),
        },
        {
          endColumn: 53,
          column: 50,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('4px', {name: '--base-size-4'}),
        },
        {
          endColumn: 66,
          column: 63,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('4px', {name: '--base-size-4'}),
        },
        {
          endColumn: 77,
          column: 74,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('4px', {name: '--base-size-4'}),
        },
      ],
    },
    {
      code: '.x { padding: -4px; }',
      unfixable: true,
      message: messages.rejected('-4px', {name: '--base-size-4'}),
      line: 1,
      column: 15,
      endColumn: 19,
      description: "CSS > Replaces '-4px' with '-$spacer-1'.",
    },
    {
      code: '.x { padding: calc(8px * 2); }',
      fixed: '.x { padding: calc(var(--base-size-8) * 2); }',
      description: 'CSS > Replaces "8px" with "var(--base-size-8)" inside calc.',
      message: messages.rejected('8px', {name: '--base-size-8'}),
      line: 1,
      endColumn: 23,
      column: 20,
    },
    {
      code: '.x { padding: 4px calc(var(--base-size-8) + 12px + var(--base-size-8)); }',
      fixed: '.x { padding: var(--base-size-4) calc(var(--base-size-8) + var(--base-size-12) + var(--base-size-8)); }',
      description: 'CSS > Complex calc expression.',
      warnings: [
        {
          endColumn: 18,
          column: 15,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('4px', {name: '--base-size-4'}),
        },
        {
          endColumn: 49,
          column: 45,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('12px', {name: '--base-size-12'}),
        },
      ],
    },
    {
      code: '.x { padding: 2px 4px; }',
      fixed: '.x { padding: 2px var(--base-size-4); }',
      description: "CSS > Replaces '4px' with 'var(--base-size-4)' and errors on '2px'.",
      warnings: [
        {
          endColumn: 18,
          column: 15,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('2px'),
        },
        {
          endColumn: 22,
          column: 19,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('4px', {name: '--base-size-4'}),
        },
      ],
    },
    {
      code: '.x { padding: var(--my-space); }',
      unfixable: true,
      message: messages.rejected('--my-space'),
      line: 1,
      column: 19,
      endColumn: 29,
      description: 'CSS > Errors on non-primer spacer.',
    },
    {
      code: '.x { margin-right: calc(var(--my-space) * -1); }',
      unfixable: true,
      message: messages.rejected('--my-space'),
      line: 1,
      column: 29,
      endColumn: 39,
      description: 'CSS > Errors on non-primer spacer in parens.',
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
  accept: [
    {
      code: '.x { padding: var(--base-size-4); .y { padding: var(--base-size-8); } }',
      description: 'SCSS > Nested css works.',
    },
  ],
  reject: [
    {
      code: '.x { padding: -$spacer-1; }',
      unfixable: true,
      message: messages.rejected('-$spacer-1'),
      line: 1,
      column: 15,
      endColumn: 25,
      description: 'SCSS > Fails on negative SCSS variable.',
    },
    {
      code: '.x { padding: 2px; .y { padding: 2px; .z { padding: 2px; } } }',
      unfixable: true,
      description: 'SCSS > Rejects nested CSS.',
      warnings: [
        {
          column: 15,
          endColumn: 18,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('2px'),
        },
        {
          column: 34,
          endColumn: 37,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('2px'),
        },
        {
          column: 53,
          endColumn: 56,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('2px'),
        },
      ],
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
        const X = styled.div\`
          padding: var(--base-size-4);
        \`;
      `,
      description: 'TSX > Styled components work.',
    },
  ],
  reject: [
    {
      code: dedent`
        const X = styled.div\`
          padding: 4px;
        \`;
      `,
      fixed: dedent`
        const X = styled.div\`
          padding: var(--base-size-4);
        \`;
      `,
      message: messages.rejected('4px', {name: '--base-size-4'}),
      line: 2,
      column: 12,
      endColumn: 15,
      description: 'TSX > Fails on pixel value.',
    },
  ],
})
