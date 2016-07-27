module.exports = {
  "files": [
    "./src/**/test/*.js"
  ],
  "require": [
  "babel-register",
  "./node_modules/kyt/utils/test-setup.js"],
  "babel": {
    "babelrc": false,
    "presets": [
      "es2015",
      "react"
    ]
  }
};
