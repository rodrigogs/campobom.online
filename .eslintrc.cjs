module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-unused-vars': 'error',
    'no-unused-expressions': 'error',
    semi: ['error', 'never'],
    indent: ['error', 2],
    quotes: ['error', 'single'],
  },
}
