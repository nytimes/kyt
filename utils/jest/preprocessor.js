const babel = require('../../config/babel')();
const babelJest = require('babel-jest');
const config = require('../kytConfig')();

const options = {
  type: 'test',
  environment: 'test',
};

const babelConfigForJest = config.modifyBabelConfig(babel, options);

module.exports = babelJest.createTransformer(babelConfigForJest);
