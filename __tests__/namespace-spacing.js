import plugin from '../plugins/namespace-spacing.js'
import dedent from 'dedent'

const plugins = [plugin]
const {
  ruleName,
  rule: { messages },
} = plugin

// General CSS Tests
testRule({
  plugins,
  ruleName,
  config: [true],
  accept: [
    {
      code: '.pr-m-2 { color: red; }',
      description: 'Namespaced margin class is valid',
    },
    {
      code: '.pr-p-2 { color: red; }',
      description: 'Namespaced padding class is valid',
    },
    {
      code: '.pr-mt-3 { color: red; }',
      description: 'Namespaced margin-top class is valid',
    },
    {
      code: '.pr-mb-4 { color: red; }',
      description: 'Namespaced margin-bottom class is valid',
    },
    {
      code: '.pr-ml-1 { color: red; }',
      description: 'Namespaced margin-left class is valid',
    },
    {
      code: '.pr-mr-2 { color: red; }',
      description: 'Namespaced margin-right class is valid',
    },
    {
      code: '.pr-mx-5 { color: red; }',
      description: 'Namespaced margin-x class is valid',
    },
    {
      code: '.pr-my-6 { color: red; }',
      description: 'Namespaced margin-y class is valid',
    },
    {
      code: '.pr-pt-1 { color: red; }',
      description: 'Namespaced padding-top class is valid',
    },
    {
      code: '.pr-pb-2 { color: red; }',
      description: 'Namespaced padding-bottom class is valid',
    },
    {
      code: '.pr-pl-3 { color: red; }',
      description: 'Namespaced padding-left class is valid',
    },
    {
      code: '.pr-pr-4 { color: red; }',
      description: 'Namespaced padding-right class is valid',
    },
    {
      code: '.pr-px-5 { color: red; }',
      description: 'Namespaced padding-x class is valid',
    },
    {
      code: '.pr-py-6 { color: red; }',
      description: 'Namespaced padding-y class is valid',
    },
    {
      code: '.container { color: red; }',
      description: 'Non-utility class is valid',
    },
    {
      code: '.btn-primary { color: red; }',
      description: 'Non-utility class with hyphen is valid',
    },
    {
      code: '.custom-margin { margin: 10px; }',
      description: 'Custom class names do not need namespacing',
    },
    {
      code: '.pr-m-2.pr-p-3 { color: red; }',
      description: 'Multiple namespaced classes are valid',
    },
    {
      code: '.pr-m-2 .pr-p-3 { color: red; }',
      description: 'Descendant selectors with namespaced classes are valid',
    },
    {
      code: '.something-m-2 { color: red; }',
      description: 'Classes that end with utility pattern but are not utility classes are valid',
    },
  ],
  reject: [
    {
      code: '.m-2 { color: red; }',
      message: messages.rejected('m-2'),
      line: 1,
      column: 1,
      endColumn: 5,
      description: 'Margin utility class without namespace is rejected',
    },
    {
      code: '.p-2 { color: red; }',
      message: messages.rejected('p-2'),
      line: 1,
      column: 1,
      endColumn: 5,
      description: 'Padding utility class without namespace is rejected',
    },
    {
      code: '.mt-3 { color: red; }',
      message: messages.rejected('mt-3'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Margin-top utility class without namespace is rejected',
    },
    {
      code: '.mb-4 { color: red; }',
      message: messages.rejected('mb-4'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Margin-bottom utility class without namespace is rejected',
    },
    {
      code: '.ml-1 { color: red; }',
      message: messages.rejected('ml-1'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Margin-left utility class without namespace is rejected',
    },
    {
      code: '.mr-2 { color: red; }',
      message: messages.rejected('mr-2'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Margin-right utility class without namespace is rejected',
    },
    {
      code: '.mx-5 { color: red; }',
      message: messages.rejected('mx-5'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Margin-x utility class without namespace is rejected',
    },
    {
      code: '.my-6 { color: red; }',
      message: messages.rejected('my-6'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Margin-y utility class without namespace is rejected',
    },
    {
      code: '.pt-1 { color: red; }',
      message: messages.rejected('pt-1'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Padding-top utility class without namespace is rejected',
    },
    {
      code: '.pb-2 { color: red; }',
      message: messages.rejected('pb-2'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Padding-bottom utility class without namespace is rejected',
    },
    {
      code: '.pl-3 { color: red; }',
      message: messages.rejected('pl-3'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Padding-left utility class without namespace is rejected',
    },
    {
      code: '.pr-4 { color: red; }',
      message: messages.rejected('pr-4'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Padding-right utility class without namespace is rejected',
    },
    {
      code: '.px-5 { color: red; }',
      message: messages.rejected('px-5'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Padding-x utility class without namespace is rejected',
    },
    {
      code: '.py-6 { color: red; }',
      message: messages.rejected('py-6'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Padding-y utility class without namespace is rejected',
    },
    {
      code: '.m-2.p-3 { color: red; }',
      description: 'Multiple unnamespaced utility classes are rejected',
      warnings: [
        {
          message: messages.rejected('m-2'),
          line: 1,
          column: 1,
          endColumn: 5,
        },
        {
          message: messages.rejected('p-3'),
          line: 1,
          column: 5,
          endColumn: 9,
        },
      ],
    },
    {
      code: '.m-2 .p-3 { color: red; }',
      description: 'Descendant selectors with unnamespaced utility classes are rejected',
      warnings: [
        {
          message: messages.rejected('m-2'),
          line: 1,
          column: 1,
          endColumn: 5,
        },
        {
          message: messages.rejected('p-3'),
          line: 1,
          column: 6,
          endColumn: 10,
        },
      ],
    },
    {
      code: '.container .m-2 { color: red; }',
      message: messages.rejected('m-2'),
      line: 1,
      column: 12,
      endColumn: 16,
      description: 'Utility class in descendant selector without namespace is rejected',
    },
    {
      code: '.m-10 { color: red; }',
      message: messages.rejected('m-10'),
      line: 1,
      column: 1,
      endColumn: 6,
      description: 'Double-digit utility classes are also rejected',
    },
    {
      code: '.m-0 { color: red; }',
      message: messages.rejected('m-0'),
      line: 1,
      column: 1,
      endColumn: 5,
      description: 'Zero-value utility classes are also rejected',
    },
  ],
})

// SCSS Specific Tests
testRule({
  plugins,
  ruleName,
  customSyntax: 'postcss-scss',
  codeFilename: 'example.scss',
  config: [true],
  accept: [
    {
      code: '.pr-m-2 { .pr-p-3 { color: red; } }',
      description: 'SCSS nested selectors with namespaced classes are valid',
    },
  ],
  reject: [
    {
      code: '.m-2 { .p-3 { color: red; } }',
      description: 'SCSS nested selectors with unnamespaced utility classes are rejected',
      warnings: [
        {
          message: messages.rejected('m-2'),
          line: 1,
          column: 1,
          endColumn: 5,
        },
        {
          message: messages.rejected('p-3'),
          line: 1,
          column: 8,
          endColumn: 12,
        },
      ],
    },
  ],
})

// Styled Components Tests
testRule({
  plugins,
  ruleName,
  customSyntax: 'postcss-styled-syntax',
  codeFilename: 'example.tsx',
  config: [true],
  accept: [
    {
      code: dedent`
        const X = styled.div\`
          .pr-m-2 {
            color: red;
          }
        \`;
      `,
      description: 'TSX > Styled components with namespaced classes work',
    },
  ],
  reject: [
    {
      code: dedent`
        const X = styled.div\`
          .m-2 {
            color: red;
          }
        \`;
      `,
      message: messages.rejected('m-2'),
      description: 'TSX > Styled components with unnamespaced utility classes are rejected',
    },
  ],
})
