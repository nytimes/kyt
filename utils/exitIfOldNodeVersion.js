// This module has to be supported by old versions of node,
// therefor no ES6 (arrow functions, const's etc)
var minNodeVersion = 6;

// Returns whether node is version `minNodeVersion` or above
module.exports = function() {
  if (Number(process.versions.node.split('.')[0]) < minNodeVersion) {
    console.error('kyt requires Node v' + minNodeVersion + '+');
    console.info('Need to run multiple versions of node? Check out nvm');
    process.exit();
  }
};
