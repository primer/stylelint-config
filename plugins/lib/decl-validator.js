const anymatch = require('anymatch')
const valueParser = require('postcss-value-parser')
const TapMap = require('tap-map')

const SKIP_VALUE_NODE_TYPES = new Set(['space', 'div'])
const SKIP_AT_RULE_NAMES = new Set(['each', 'for', 'function', 'mixin'])

module.exports = function declarationValidator(rules, options = {}) {
  const {formatMessage = defaultMessageFormatter, variables, verbose = false} = options
  const variableReplacements = new TapMap()
  if (variables) {
    for (const [name, {values}] of Object.entries(variables)) {
      for (const value of values) {
        variableReplacements.tap(value, () => []).push(name)
      }
    }
  }

  const validators = Object.entries(rules)
    .map(([key, rule]) => {
      if (rule === false) {
        return false
      }
      const {name = key, props = name, expects = `a ${name} value`} = rule
      const replacements = Object.assign({}, rule.replacements, getVariableReplacements(rule.values))
      // console.warn(`replacements for "${key}": ${JSON.stringify(replacements)}`)
      Object.assign(rule, {name, props, expects, replacements})
      return {
        rule,
        matchesProp: anymatch(props),
        validate: Array.isArray(rule.components) ? componentValidator(rule) : valueValidator(rule),
      }
    })
    .filter(Boolean)

  const validatorsByProp = new TapMap()
  const validatorsByReplacementValue = new Map()
  for (const validator of validators) {
    for (const value of Object.keys(validator.rule.replacements)) {
      validatorsByReplacementValue.set(value, validator)
    }
  }

  return decl => {
    if (closest(decl, isSkippableAtRule)) {
      if (verbose) {
        // eslint-disable-next-line no-console
        console.warn(`skipping declaration: ${decl.parent.toString()}`)
      }
      // As a general rule, any rule nested in an at-rule is ignored, since
      // @for, @each, @mixin, and @function blocks can use whatever variables
      // they want
      return {valid: true}
    }
    const validator = getPropValidator(decl.prop)
    if (validator) {
      const result = validator.validate(decl)
      result.errors = result.errors.map(formatMessage)
      return result
    } else {
      return {valid: true}
    }
  }

  function getVariableReplacements(values) {
    const replacements = {}
    const varValues = (Array.isArray(values) ? values : [values]).filter(v => typeof v === 'string' && v.includes('$'))
    const matches = anymatch(varValues)
    for (const [value, aliases] of variableReplacements.entries()) {
      for (const alias of aliases) {
        if (matches(alias)) {
          replacements[value] = alias
        }
      }
    }
    return replacements
  }

  function getPropValidator(prop) {
    return validatorsByProp.tap(prop, () => validators.find(v => v.matchesProp(prop)))
  }

  function valueValidator({expects, values, replacements, singular = false}) {
    const matches = anymatch(values)
    return function validate({prop, value}, nested) {
      if (matches(value)) {
        return {
          valid: true,
          errors: [],
          fixable: false,
          replacement: undefined,
        }
      } else if (replacements[value]) {
        let replacement = value
        do {
          replacement = replacements[replacement]
        } while (replacements[replacement])
        return {
          valid: false,
          errors: [{expects, prop, value, replacement}],
          fixable: true,
          replacement,
        }
      } else {
        if (nested || singular) {
          return {
            valid: false,
            errors: [{expects, prop, value}],
            fixable: false,
            replacement: undefined,
          }
        }

        const parsed = valueParser(value)
        const validations = parsed.nodes
          .map((node, index) => Object.assign(node, {index}))
          .filter(node => !SKIP_VALUE_NODE_TYPES.has(node.type))
          .map(node => {
            const validation = validate({prop, value: valueParser.stringify(node)}, true)
            validation.index = node.index
            return validation
          })

        const valid = validations.every(v => v.valid)
        if (valid) {
          return {valid, errors: [], fixable: false, replacement: undefined}
        }

        const fixable = validations.some(v => v.fixable)
        const errors = validations.reduce((list, v) => list.concat(v.errors), [])

        let replacement = undefined
        for (const validation of validations) {
          if (fixable && validation.replacement) {
            parsed.nodes[validation.index] = {type: 'word', value: validation.replacement}
          }
        }

        if (fixable) {
          replacement = valueParser.stringify(parsed)
        }

        return {
          valid,
          fixable,
          errors,
          replacement,
        }
      }
    }
  }

  function componentValidator({expects, components, values, replacements}) {
    const matchesCompoundValue = anymatch(values)
    return decl => {
      const {prop, value: compoundValue} = decl
      const parsed = valueParser(compoundValue)
      if (parsed.nodes.length === 1 && matchesCompoundValue(compoundValue)) {
        return {valid: true, errors: []}
      }

      const errors = []

      let fixable = false
      let componentIndex = 0
      for (const [index, node] of Object.entries(parsed.nodes)) {
        if (SKIP_VALUE_NODE_TYPES.has(node.type)) {
          continue
        }

        const value = valueParser.stringify(node)

        let componentProp = components[componentIndex++]
        let validator = getPropValidator(componentProp)
        if (validatorsByReplacementValue.has(value)) {
          validator = validatorsByReplacementValue.get(value)
          componentProp = validator.rule.name
        }

        const nestedProp = `${componentProp} (in ${prop})`
        if (validator) {
          const result = validator.validate({prop: nestedProp, value}, true)
          if (result.replacement) {
            parsed.nodes[index] = {
              type: 'word',
              value: result.replacement,
            }
            fixable = true
          }
          for (const error of result.errors) {
            errors.push(error)
          }
        } else {
          errors.push({expects, prop: nestedProp, value})
        }
      }

      let replacement = fixable ? valueParser.stringify(parsed) : undefined

      // if a compound replacement exists, suggest *that* instead
      if (replacement && replacements[replacement]) {
        do {
          replacement = replacements[replacement]
        } while (replacements[replacement])
        return {
          valid: false,
          errors: [{expects, prop, value: compoundValue, replacement}],
          fixable: true,
          replacement,
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        fixable,
        replacement,
      }
    }
  }

  function isSkippableAtRule(node) {
    return node.type === 'atrule' && SKIP_AT_RULE_NAMES.has(node.name)
  }
}

function defaultMessageFormatter(error) {
  const {expects, value, replacement} = error
  const expected = replacement ? `"${replacement}"` : expects
  return `Please use ${expected} instead of "${value}"`
}

function closest(node, test) {
  let ancestor = node
  do {
    if (test(ancestor)) return ancestor
  } while ((ancestor = ancestor.parent))
}
