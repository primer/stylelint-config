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
