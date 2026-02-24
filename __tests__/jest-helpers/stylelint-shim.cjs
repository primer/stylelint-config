'use strict'

// CJS shim for stylelint that uses Node.js native require.
// This bypasses Jest's module system which throws ERR_REQUIRE_ESM
// for stylelint 17's ESM-only exports.
const nativeRequire = globalThis.__nativeRequire
const stylelintPath = nativeRequire.resolve('stylelint')
module.exports = nativeRequire(stylelintPath)
