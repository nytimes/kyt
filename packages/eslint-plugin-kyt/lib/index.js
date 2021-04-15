const cssInJsNamespace = require('./rules/css-in-js-namespace').rule;
const defaultProps = require('./rules/default-props').rule;
const noDirectMomentImport = require('./rules/no-direct-moment-import').rule;
const noImmediateReturn = require('./rules/no-immediate-return').rule;
const validateDoubleUnderscoreDirs = require('./rules/validate-double-underscore-dirs').rule;

exports.rules = {
  'css-in-js-namespace': cssInJsNamespace,
  'default-props': defaultProps,
  'no-direct-moment-import': noDirectMomentImport,
  'no-immediate-return': noImmediateReturn,
  'validate-double-underscore-dirs': validateDoubleUnderscoreDirs,
};
