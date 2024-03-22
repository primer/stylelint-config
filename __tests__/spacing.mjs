import {testRule} from 'stylelint-test-rule-node'

import plugin from '../plugins/spacing.mjs'

const {
  rule: {messages, ruleName},
} = plugin

testRule({
  plugins: [plugin],
  ruleName,
  config: true,
  fix: true,

  accept: [],

  reject: [
    {
      code: '.a { padding: 4px 4px; }',
    },
    {
      code: '.a { gap: 4px; }',
    },
    {
      code: '.a { padding: calc(3px + 1px) }',
    },
    {
      code: '.foo { padding: 4px; display: none; }',
      fixed: '.foo { padding: var(--base-size-4); display: none; }',
      message: messages.rejected('4px', 'base-size-4'),
      line: 1,
      column: 17,
      endLine: 1,
      endColumn: 20,
    },
  ],
})
