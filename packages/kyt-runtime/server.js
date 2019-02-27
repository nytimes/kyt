const fs = require('fs');
const Loadable = require('react-loadable');
const { clientAssetsFile, loadableAssetsFile } = require('kyt-utils/paths')();
const { getBundles } = require('./loadable-plugin');

exports.preloadDynamicImports = Loadable.preloadAll;

exports.DynamicImports = Loadable.Capture;

// Get JS and CSS bundles for an entry (defaults to `main`)
// Compares `modules` with `loadableBundles`
// `assets` may exist in an alternate location, so allow it to be passed
// `loadableBundles` may exist in an alternate location, so allow it to be passed
// Filter out entry bundles (JS and CSS), these can show up when you have
//   small bundles that all get hoisted to the entry bundle
exports.getBundles = ({ entry = 'main', modules, assets = null, loadableBundles = null }) => {
  if (!assets) {
    const assetsFile = fs.readFileSync(clientAssetsFile);
    assets = JSON.parse(assetsFile);
  }

  const runtimeBundle = assets[`runtime~${entry}.js`];
  const entryBundle = assets[`${entry}.js`];
  const vendorBundle = assets['vendor.js'];
  const cssBundle = assets[`${entry}.css`];

  const bundleManifest = {
    runtimeBundle,
    entryBundle,
    vendorBundle,
    cssBundle,
    styles: [],
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
  Object.keys(loadableBundles.entries).forEach(key => {
    hashes = hashes.concat([assets[`${key}.js`], assets[`${key}.css`]]).filter(Boolean);
  });

  const bundles = getBundles(loadableBundles.bundles, modules);

  const cssBundles = bundles.filter(b => b.file.endsWith('.css') && !hashes.includes(b));
  bundleManifest.styles = [...new Set(cssBundles.map(b => b.publicPath))];

  const jsBundles = bundles.filter(b => b.file.endsWith('.js') && !hashes.includes(b));
  bundleManifest.scripts = [...new Set(jsBundles.map(b => b.publicPath))];

  return bundleManifest;
};
