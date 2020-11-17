const defaultProps = require('./rules/default-props').rule;
const cssInJsNamespace = require('./rules/css-in-js-namespace').rule;
const noDirectMomentImport = require('./rules/no-direct-moment-import').rule;
const validateDoubleUnderscoreDirs = require('./rules/validate-double-underscore-dirs').rule;

exports.rules = {
  'default-props': defaultProps,
  'css-in-js-namespace': cssInJsNamespace,
  'no-direct-moment-import': noDirectMomentImport,
  'validate-double-underscore-dirs': validateDoubleUnderscoreDirs,
};
