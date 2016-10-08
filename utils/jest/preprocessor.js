const babel = require('../../config/babel')();
const babelJest = require('babel-jest');
const config = require('../kytConfig')();

const babelConfigForJest = config.modifyBabelConfig(babel);

module.exports = babelJest.createTransformer(babelConfigForJest);
