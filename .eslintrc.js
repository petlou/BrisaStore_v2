module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    "no-ram-reassign": "off",
    "no-param-reassign": 0,
    "no-console": 0,
    "no-return-assign": "off",
    "no-restricted-syntax": "off",
    "camelcase": "off",
    "eqeqeq": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
  },
};
