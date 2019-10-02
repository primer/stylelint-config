module.exports = {splitTokens}

/**
 * In order to recognize "components" of compound properties like
 * border and font, we have to know how to split up a CSS property
 * value string into its constituent parts. However, just splitting on
 * spaces isn't good enough, for instance:
 *
 * ```css
 * border: ($spacer-2 - 1) solid lighten($gray-300, 4%);
 * ```
 *
 * Math expressions, functions, and nested instances of each are
 * treated as singular "tokens", so the above value would yield:
 *
 * 1. "($spacer-2 - 1)"
 * 2. "solid"
 * 3. "lighten($gray-300, 4%)"
 */
function splitTokens(value) {
  const tokens = []
  let token = ''
  let parens = 0
  for (let i = 0; i < value.length; i++) {
    const chr = value.charAt(i)
    if (chr === '(') {
      token += chr
      parens++
    } else if (parens) {
      token += chr
      if (chr === ')') {
        if (--parens === 0) {
          tokens.push(token)
          token = ''
        }
      }
    } else if (chr === ' ') {
      if (token) {
        tokens.push(token)
      }
      token = ''
    } else {
      token += chr
    }
  }
  if (token) {
    tokens.push(token)
  }
  return tokens.map(token => token.replace(/,$/, ''))
}
