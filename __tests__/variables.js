const dedent = require('dedent')
const stylelint = require('stylelint')
const {createVariableRule, reverseAssignments} = require('../plugins/lib/variable-rules')

describe('reverseAssignments()', () => {
  it('works', () => {
    expect(reverseAssignments(`
      $spacer-1: 8px !default;
      $h0-size: 30px !default;
      $h6-size: 12px !default;
    `)).toEqual({
      '8px': '$spacer-1',
      '30px': '$h0-size',
      '12px': '$h6-size'
    })
  })
})

xdescribe('createVariableRule()', () => {
  function configWithRule(ruleName, config, options) {
    return {
      plugins: [createVariableRule(ruleName, config)],
      rules: {
        [ruleName]: options
      }
    }
  }

  it(`doesn't run when disabled`, () => {
    return stylelint
      .lint({
        code: `.x { color: #f00; }`,
        config: configWithRule(
          'primer/test',
          {
            test: {
              props: 'color',
              values: '$text-*'
            }
          },
          false
        )
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })

  it(`doesn't reject properties we don't care about`, () => {
    const plugin = createVariableRule('primer/test', {
      test: {
        props: 'color',
        values: '$text-*'
      }
    })
    return stylelint
      .lint({
        code: `.x { display: block; }`,
        config: configWithOptions(plugin, false)
      })
      .then(data => {
        expect(data).not.toHaveErrored()
        expect(data).toHaveWarningsLength(0)
      })
  })
})
