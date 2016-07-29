/**
 * Configuration for AVA.
 * Added to user's package.json during init.
 *
**/
module.exports = {
  "files": [
    "./src/**/test/*.js"
  ],
  "require": [
  "babel-register",
  "./node_modules/kyt/utils/jsdom-setup.js"],
  "babel": {
    "babelrc": false,
    "presets": [
      "es2015",
      "react"
    ]
  }
};
