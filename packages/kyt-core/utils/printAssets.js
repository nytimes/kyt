// Prints webpack asset stats
const fs = require('fs');
const path = require('path');
const filesize = require('filesize');
const gzipSize = require('gzip-size');
const stripAnsi = require('strip-ansi');
const logger = require('kyt-utils/logger');

module.exports = (stats, clientConfig) => {
  const assetPath = clientConfig.output.path;
  const assets = stats
    .toJson()
    .assets.filter(asset => /\.(js|css)$/.test(asset.name))
    .map(asset => {
      const file = fs.readFileSync(path.resolve(assetPath, asset.name));
      const gzSize = gzipSize.sync(file);
      return {
        folder: path.join('build/public', path.dirname(asset.name)),
        gzSize,
        gzSizeLabel: `(${filesize(gzSize)} gzip)`,
        name: path.basename(asset.name),
        size: asset.size,
        sizeLabel: filesize(asset.size),
      };
    });

  assets.sort((a, b) => b.size - a.size);

  const longestSizeLabelLength = Reflect.apply(
    Math.max,
    null,
    assets.map(a => stripAnsi(a.sizeLabel).length)
  );

  const longestGzSizeLabelLength = Reflect.apply(
    Math.max,
    null,
    assets.map(a => stripAnsi(a.gzSizeLabel).length)
  );

  const addLabelPadding = (label, longestLength) => {
    let padded = label;
    const length = stripAnsi(label).length;
    if (length < longestLength) {
      const rightPadding = ' '.repeat(longestLength - length);
      padded += rightPadding;
    }
    return padded;
  };

  assets.forEach(asset => {
    const sizeLabel = addLabelPadding(asset.sizeLabel, longestSizeLabelLength);
    const gzSizeLabel = addLabelPadding(asset.gzSizeLabel, longestGzSizeLabelLength);
    logger.log(`    ${sizeLabel}    ${gzSizeLabel}    ${asset.folder + path.sep + asset.name}`);
  });
};
