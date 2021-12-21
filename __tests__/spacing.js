const {ruleName} = require('../plugins/spacing')

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/spacing.js'],
  customSyntax: 'postcss-scss',
  ruleName,
  config: [true],
  fix: true,
  accept: [
    {
      code: '.x { padding: $spacer-4; }',
      description: 'One variable is valid.'
    },
    {
      code: '.x { padding: $spacer-4 $spacer-3; }',
      description: 'Two variables are valid.'
    },
    {
      code: '.x { padding: 0 0; }',
      description: 'Ignore zero values.'
    },
    {
      code: '.x { margin: auto; }',
      description: 'Ignore auto values.'
    },
    {
      code: '.x { padding: calc($spacer-4 * 2); }',
      description: 'Finds variable calc values.'
    },
    {
      code: '.x { padding: calc(#{$spacer-4} * 2); }',
      description: 'Finds interpolated calc values.'
    }
  ],
  reject: [
    {
      code: '.x { padding: 4px; }',
      fixed: '.x { padding: $spacer-1; }',
      message: `Please replace 4px with spacing variable '$spacer-1'. (primer/spacing)`,
      line: 1,
      column: 15,
      description: "Replaces '4px' with '$spacer-1'."
    },
    {
      code: '.x { padding: -4px; }',
      fixed: '.x { padding: -$spacer-1; }',
      message: `Please replace 4px with spacing variable '$spacer-1'. (primer/spacing)`,
      line: 1,
      column: 15,
      description: "Replaces '-4px' with '-$spacer-1'."
    },
    {
      code: '.x { padding: calc(8px * 2); }',
      fixed: '.x { padding: calc($spacer-2 * 2); }',
      description: 'Replaces "8px" with "$spacer-2" inside calc.',
      message: `Please replace 8px with spacing variable '$spacer-2'. (primer/spacing)`,
      line: 1,
      column: 20
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
            "Please use a primer spacer variable instead of '3px'. Consult the primer docs for a suitable replacement. https://primer.style/css/support/spacing (primer/spacing)"
        },
        {
          column: 19,
          line: 1,
          rule: 'primer/spacing',
          severity: 'error',
          message: "Please replace 4px with spacing variable '$spacer-1'. (primer/spacing)"
        }
      ]
    },
    {
      code: '.x { padding: $spacer-100; }',
      unfixable: true,
      message:
        "Please use a primer spacer variable instead of '$spacer-100'. Consult the primer docs for a suitable replacement. https://primer.style/css/support/spacing (primer/spacing)",
      line: 1,
      column: 15,
      description: 'Errors on non-primer spacer.'
    },
    {
      code: '.x { margin-right: (-$spacing-task-item-1); }',
      unfixable: true,
      message:
        "Please use a primer spacer variable instead of '-$spacing-task-item-1'. Consult the primer docs for a suitable replacement. https://primer.style/css/support/spacing (primer/spacing)",
      line: 1,
      column: 21,
      description: 'Errors on non-primer spacer in parens.'
    }
  ]
})
