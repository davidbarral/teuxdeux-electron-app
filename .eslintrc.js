module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2020: true,
  },

  parserOptions: {
    ecmaVersion: 2020,
  },

  ignorePatterns: ["**/dist/**/*.js"],

  plugins: ["prettier"],

  extends: ["unobtrusive", "unobtrusive/import", "prettier"],

  rules: {
    "prettier/prettier": ["error", require("./.prettierrc.js")],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-unused-vars": ["warn", { vars: "all", varsIgnorePattern: "^_", args: "all", argsIgnorePattern: "^_" }],
    "import/extensions": ["error", "always", { ignorePackages: true }],
  },
};
