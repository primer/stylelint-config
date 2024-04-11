import {createVariableRule} from '../plugins/lib/variable-rules.js'
import {jest} from '@jest/globals'

describe('variable rules (meta)', () => {
  it('rules can be specified as functions', () => {
    const createRule = jest.fn(() => ({
      width: {
        values: '*',
      },
    }))

    const plugin = createVariableRule('primer/derp', createRule)
    expect(plugin.ruleName).toBe('primer/derp')
    expect(plugin.rules).toBe(createRule)
    expect(createRule).not.toHaveBeenCalled()

    // enabled = false should not call it
    plugin.rule(false)
    expect(createRule).not.toHaveBeenCalled()

    // enabled = true should call it
    const options = {hi: true}
    plugin.rule(true, options)
    expect(createRule).toHaveBeenCalledWith(
      expect.objectContaining({
        options,
        ruleName: 'primer/derp',
      }),
    )
  })

  it('rules can be overridden with functions', () => {
    const createRule = jest.fn(() => ({
      width: {
        values: '*',
      },
    }))

    const plugin = createVariableRule('primer/derp', createRule)

    expect(plugin.ruleName).toBe('primer/derp')
    expect(plugin.rules).toBe(createRule)
    expect(createRule).not.toHaveBeenCalled()

    const getRules = jest.fn(() => ({
      width: {
        values: '1px',
      },
    }))

    plugin.rule(true, {rules: getRules})

    expect(getRules).toHaveBeenCalledWith(
      expect.objectContaining({
        options: {},
        rules: {
          width: expect.objectContaining({values: '1px'}),
        },
        ruleName: 'primer/derp',
      }),
    )
  })
})
