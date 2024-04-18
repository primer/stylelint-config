import plugin from '../plugins/spacing.js'

const plugins = [plugin];
const {
  ruleName,
  rule: { messages }
} = plugin

// eslint-disable-next-line no-undef
testRule({
  plugins,
  ruleName,
  config: [true, { }],
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
      description: "CSS > Errors on value not in spacer list",
    },
    {
      code: '.x { padding-bottom: 0.25rem; }',
      fixed: '.x { padding-bottom: var(--base-size-4); }',
      message: messages.rejected('0.25rem', { 'name': '--base-size-4' }),
      line: 1,
      column: 22,
      description: "CSS > Replaces '0.25rem' with 'var(--base-size-4)'.",
    },
    {
      code: '.x { padding: 4px; }',
      fixed: '.x { padding: var(--base-size-4); }',
      message: messages.rejected('4px', { 'name': '--base-size-4' }),
      line: 1,
      column: 15,
      description: "CSS > Replaces '4px' with '--base-size-4'.",
    },
    {
      code: '.x { padding: -4px; }',
      unfixable: true,
      message: messages.rejected('-4px', { 'name': '--base-size-4' }),
      line: 1,
      column: 15,
      description: "CSS > Replaces '-4px' with '-$spacer-1'.",
    },
    {
      code: '.x { padding: calc(8px * 2); }',
      fixed: '.x { padding: calc(var(--base-size-8) * 2); }',
      description: 'CSS > Replaces "8px" with "var(--base-size-8)" inside calc.',
      message: messages.rejected('8px', { 'name': '--base-size-8' }),
      line: 1,
      column: 20,
    },
    {
      code: '.x { padding: 4px calc(var(--base-size-8) + 12px + var(--base-size-8)); }',
      fixed: '.x { padding: var(--base-size-4) calc(var(--base-size-8) + var(--base-size-12) + var(--base-size-8)); }',
      description: 'CSS > Complex calc expression.',
      warnings: [
        {
          column: 15,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('4px', { 'name': '--base-size-4' }),
        },
        {
          column: 45,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('12px', { 'name': '--base-size-12' }),
        },
      ],
    },
    {
      code: '.x { padding: 3px 4px; }',
      fixed: '.x { padding: 3px var(--base-size-4); }',
      description: "CSS > Replaces '4px' with 'var(--base-size-4)' and errors on '3px'.",
      warnings: [
        {
          column: 15,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('3px'),
        },
        {
          column: 19,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('4px', { 'name': '--base-size-4' }),
        },
      ],
    },
    {
      code: '.x { padding: var(--my-space); }',
      unfixable: true,
      message: messages.rejected('--my-space'),
      line: 1,
      column: 19,
      description: 'CSS > Errors on non-primer spacer.',
    },
    {
      code: '.x { margin-right: calc(var(--my-space) * -1); }',
      unfixable: true,
      message: messages.rejected('--my-space'),
      line: 1,
      column: 29,
      description: 'CSS > Errors on non-primer spacer in parens.',
    },
  ],
})

testRule({
  plugins,
  ruleName,
  customSyntax: 'postcss-scss',
  codeFilename: 'example.scss',
  config: [true, { }],
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
      code: '.x { padding: 3px; .y { padding: 3px; .z { padding: 3px; } } }',
      unfixable: true,
      description: 'SCSS > Rejects nested CSS.',
      warnings: [
        {
          column: 15,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('3px'),
        },
        {
          column: 34,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('3px'),
        },
        {
          column: 53,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: messages.rejected('3px'),
        },
      ],
    },
  ],
})