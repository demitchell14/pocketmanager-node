module.exports = {
  root: true,
  env: {
      "shared-node-browser": true,
      es6: true,
      commonjs: true,

  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    parser: "babel-eslint",
      "ecmaVersion": 9,
      "sourceType": "module",
      "ecmaFeatures": {
          "jsx": true,
          "impliedStrict ": true
      }
  }
};
