
var minNodeVersion = 6;

// Returns whether node is version `minNodeVersion` or above
module.exports = () => {
  if (Number(process.versions.node.split('.')[0]) < minNodeVersion) {
    console.error(`kyt requires Node v${minNodeVersion}+`);
    console.info('Need to run multiple versions of node? Check out nvm');
    process.exit();
  }
};
