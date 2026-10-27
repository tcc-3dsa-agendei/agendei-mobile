// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    // These packages use exports that eslint-plugin-import's Node resolver cannot inspect.
    settings: { 'import/core-modules': ['zod', '@brazilian-utils/brazilian-utils'] },
  },
]);
