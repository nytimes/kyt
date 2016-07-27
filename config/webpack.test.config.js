
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
console.log('clearly loading');
var options = {
  environment: "TEST"
};
module.exports = merge.smart(baseConfig(options), {});
