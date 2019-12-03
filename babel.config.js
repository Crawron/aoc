module.exports = {
  presets: ["@babel/env", "@babel/typescript"],
  plugins: [
    "@babel/transform-runtime",
    ["@babel/proposal-decorators", { legacy: true }],
    ["@babel/proposal-class-properties", { loose: true }],
    "@babel/proposal-nullish-coalescing-operator",
    "@babel/proposal-optional-chaining",
  ],
}
