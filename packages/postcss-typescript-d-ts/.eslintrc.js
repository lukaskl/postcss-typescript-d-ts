module.exports = {
  env: { node: true, es6: true },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'jest', 'jest-formatting'],
  parserOptions: {
    ecmaVersion: 2017,
  },
  rules: {
    'prettier/prettier': 'warn',
    'jest/expect-expect': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
}
