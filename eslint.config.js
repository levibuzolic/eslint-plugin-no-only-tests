const plugin = require('./index');
const js = require('@eslint/js');

/** @type {import('eslint').Linter.Config} */
module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
    },
    plugins: {
      'no-only-tests': plugin,
    },
    rules: {
      'no-only-tests/no-only-tests': 'error',
    },
  },
];
