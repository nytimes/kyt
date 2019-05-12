const logger = require('kyt-utils/logger');

let hasTestedForNodeSass = false;

module.exports = asset => {
  const isSassFile = /\.scss$/.test(asset);
  if (isSassFile && !hasTestedForNodeSass) {
    hasTestedForNodeSass = true;
    try {
      // eslint-disable-next-line global-require, import/no-unresolved
      require('node-sass');
    } catch (e) {
      logger.error(
        '`node-sass` is a required dependency for using Sass with kyt. Please install it in your package.'
      );
    }
  }
  return isSassFile;
};
