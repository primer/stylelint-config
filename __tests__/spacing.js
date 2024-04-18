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
      description: "Errors on value not in spacer list",
    },
    {
      code: '.x { padding-bottom: 0.25rem; }',
      fixed: '.x { padding-bottom: var(--base-size-4); }',
      message: messages.rejected('0.25rem', { 'name': '--base-size-4' }),
      line: 1,
      column: 22,
      description: "Replaces '0.25rem' with 'var(--base-size-4)'.",
    },
    {
      code: '.x { padding: 4px; }',
      fixed: '.x { padding: var(--base-size-4); }',
      message: messages.rejected('4px', { 'name': '--base-size-4' }),
      line: 1,
      column: 15,
      description: "Replaces '4px' with '--base-size-4'.",
    },
    {
      code: '.x { padding: -4px; }',
      fixed: '.x { padding: -$spacer-1; }',
      message: `Please replace 4px with spacing variable '$spacer-1'. (primer/spacing)`,
      line: 1,
      column: 15,
      description: "Replaces '-4px' with '-$spacer-1'.",
    },
    {
      code: '.x { padding: calc(8px * 2); }',
      fixed: '.x { padding: calc($spacer-2 * 2); }',
      description: 'Replaces "8px" with "$spacer-2" inside calc.',
      message: `Please replace 8px with spacing variable '$spacer-2'. (primer/spacing)`,
      line: 1,
      column: 20,
    },
    {
      code: '.x { padding: 6px ($spacer-3 + 12px + $spacer-2); }',
      unfixable: true,
      description: 'Complex calc expression.',
      warnings: [
        {
          column: 15,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message:
            "Please use a primer spacer variable instead of '6px'. Consult the primer docs for a suitable replacement. https://primer.style/css/storybook/?path=/docs/support-spacing--docs (primer/spacing)",
        },
        {
          column: 32,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message:
            "Please use a primer spacer variable instead of '12px'. Consult the primer docs for a suitable replacement. https://primer.style/css/storybook/?path=/docs/support-spacing--docs (primer/spacing)",
        },
      ],
    },
    {
      code: '.x { padding: 3px 4px; }',
      fixed: '.x { padding: 3px $spacer-1; }',
      description: "Replaces '4px' with '$spacer-1' and errors on '3px'.",
      warnings: [
        {
          column: 15,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message:
            "Please use a primer spacer variable instead of '3px'. Consult the primer docs for a suitable replacement. https://primer.style/css/storybook/?path=/docs/support-spacing--docs (primer/spacing)",
        },
        {
          column: 19,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: "Please replace 4px with spacing variable '$spacer-1'. (primer/spacing)",
        },
      ],
    },
    {
      code: '.x { padding: $spacer-100; }',
      unfixable: true,
      message:
        "Please use a primer spacer variable instead of '$spacer-100'. Consult the primer docs for a suitable replacement. https://primer.style/css/storybook/?path=/docs/support-spacing--docs (primer/spacing)",
      line: 1,
      column: 15,
      description: 'Errors on non-primer spacer.',
    },
    {
      code: '.x { margin-right: (-$spacing-task-item-1); }',
      unfixable: true,
      message:
        "Please use a primer spacer variable instead of '-$spacing-task-item-1'. Consult the primer docs for a suitable replacement. https://primer.style/css/storybook/?path=/docs/support-spacing--docs (primer/spacing)",
      line: 1,
      column: 21,
      description: 'Errors on non-primer spacer in parens.',
    },
    {
      code: '.x { padding: 3px; .y { padding: 3px; .z { padding: 3px; } } }',
      unfixable: true,
      description: 'Rejects nested CSS.',
      warnings: [
        {
          column: 15,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message:
            "Please use a primer spacer variable instead of '3px'. Consult the primer docs for a suitable replacement. https://primer.style/css/storybook/?path=/docs/support-spacing--docs (primer/spacing)",
        },
        {
          column: 34,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message:
            "Please use a primer spacer variable instead of '3px'. Consult the primer docs for a suitable replacement. https://primer.style/css/storybook/?path=/docs/support-spacing--docs (primer/spacing)",
        },
        {
          column: 53,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message:
            "Please use a primer spacer variable instead of '3px'. Consult the primer docs for a suitable replacement. https://primer.style/css/storybook/?path=/docs/support-spacing--docs (primer/spacing)",
        },
      ],
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
  ]
})