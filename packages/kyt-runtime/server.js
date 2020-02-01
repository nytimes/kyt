const fs = require('fs');
const { clientAssetsFile, loadableAssetsFile } = require('kyt-utils/paths')();
const { preloadAll } = require('./lib/loadable');
const { getBundles } = require('./loadable-plugin');
const { Capture } = require('./Capture');

exports.preloadDynamicImports = preloadAll;

exports.DynamicImports = Capture;

// Get JS bundles for an entry (defaults to `main`)
// Compares `modules` with `loadableBundles`
// `assets` may exist in an alternate location, so allow it to be passed
// `loadableBundles` may exist in an alternate location, so allow it to be passed
// Filter out entry bundle, it can show up when you have small bundles that all get hoisted to the entry bundle
exports.getBundles = ({ entry = 'main', modules, assets = null, loadableBundles = null }) => {
  if (!assets) {
    const assetsFile = fs.readFileSync(clientAssetsFile);
    assets = JSON.parse(assetsFile);
  }

  const runtimeBundle = assets[`runtime~${entry}.js`];
  const entryBundle = assets[`${entry}.js`];
  const vendorBundle = assets['vendor.js'];

  const bundleManifest = {
    runtimeBundle,
    entryBundle,
    vendorBundle,
    scripts: [],
  };

  if (!modules || modules.length === 0) {
    return bundleManifest;
  }

  if (!loadableBundles) {
    const loadableStats = fs.readFileSync(loadableAssetsFile);
    loadableBundles = JSON.parse(loadableStats);
  }

  let hashes = [];
  loadableBundles.entries.forEach(key => {
    hashes = hashes.concat([assets[`${key}.js`]]).filter(Boolean);
  });

  const bundles = getBundles(loadableBundles.bundles, modules);

  const jsBundles = bundles.filter(b => b.file.endsWith('.js') && !hashes.includes(b.publicPath));
  bundleManifest.scripts = [...new Set(jsBundles.map(b => b.publicPath))];

  return bundleManifest;
};
