
// Prints webpack asset stats
const path = require('path');
const filesize = require('filesize');
const stripAnsi = require('strip-ansi');
const logger = require('../cli/logger');

module.exports = (stats) => {
  const assets = stats.toJson().assets
    .filter(asset => /\.(js|css)$/.test(asset.name))
    .map(asset => ({
      folder: path.join('build/public', path.dirname(asset.name)),
      name: path.basename(asset.name),
      size: asset.size,
      sizeLabel: filesize(asset.size),
    }));

  assets.sort((a, b) => b.size - a.size);

  const longestSizeLabelLength = Reflect.apply(Math.max, null,
    assets.map(a => stripAnsi(a.sizeLabel).length)
  );

  assets.forEach((asset) => {
    let sizeLabel = asset.sizeLabel;
    const sizeLength = stripAnsi(sizeLabel).length;
    if (sizeLength < longestSizeLabelLength) {
      const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      sizeLabel += rightPadding;
    }
    logger.log(`    ${sizeLabel}    ${asset.folder + path.sep + asset.name}`);
  });
};
