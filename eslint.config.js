import eslintPluginGithub from 'eslint-plugin-github'
import globals from 'globals'

export default [
  {
    ignores: ['coverage/', 'node_modules/', 'dist/', '__tests__/__fixtures__/', 'rollup.config.js'],
  },
  {
    ...eslintPluginGithub.getFlatConfigs().recommended,
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es6,
      },
    },
    rules: {
      ...eslintPluginGithub.getFlatConfigs().recommended.rules,
      'import/no-commonjs': 'off',
      'github/no-then': 'off',
      'i18n-text/no-en': 'off',
      'import/extensions': ['error', 'ignorePackages'],
      // stylelint 17 is ESM-only and has no `main` field, only `exports`. The legacy
      // eslint-import-resolver-node (used by eslint-plugin-import@2) cannot resolve
      // packages that rely solely on the `exports` field, so we opt out for `stylelint`.
      'import/no-unresolved': ['error', {ignore: ['^stylelint$']}],
    },
  },
  {
    files: ['__tests__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
        testRule: 'readonly',
        testRuleConfigs: 'readonly',
      },
    },
    rules: {
      'import/no-named-as-default-member': 'off',
    },
  },
]
