'use strict'

// Capture Node.js native require before Jest patches it.
// This enables CJS modules (like stylelint-browser-compat) to load
// stylelint 17 (ESM-only) via require(), which Jest's module system
// does not support but Node.js 22+ does natively.
globalThis.__nativeRequire = require
