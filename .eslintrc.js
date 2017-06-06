

module.exports = {
  // extends: path.join(base, "config/eslint/.eslintrc-source")
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: ['standard', 'vue'],
  plugins: [
    'html'
  ]
};
