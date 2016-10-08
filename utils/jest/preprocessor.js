const babelJest = require('babel-jest');

const options = {
  type: 'test',
  environment: 'test',
};

const babelConfigForJest = require('../../config/babel')(options);

module.exports = babelJest.createTransformer(babelConfigForJest);
