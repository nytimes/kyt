import fs from 'fs';
import { getBundles as getLoadableBundles } from './loadable-plugin';

export { preloadAll as preloadDynamicImports } from './loadable';

export { Capture as DynamicImports } from './Capture';

const { clientAssetsFile, loadableAssetsFile } = require('kyt-utils/paths')();

// Get JS bundles for an entry (defaults to `main`)
// Compares `modules` with `loadableBundles`
// `assets` may exist in an alternate location, so allow it to be passed
// `loadableBundles` may exist in an alternate location, so allow it to be passed
// Filter out entry bundle, it can show up when you have small bundles that all get hoisted to the entry bundle
export const getBundles = ({ entry = 'main', modules, assets = null, loadableBundles = null }) => {
  if (!assets) {
    const assetsFile = fs.readFileSync(clientAssetsFile);
    assets = JSON.parse(assetsFile);
  }

  const runtimeBundle = assets[`runtime~${entry}.js`];
  const entryBundle = assets[`${entry}.js`];
  const vendorBundle = assets['vendor.js'];
  const cssModulesStyles = assets['cssModulesStyles.css'] || assets[`${entry}.css`];
  const cssModulesBundle = assets['cssModulesStyles.js'];

  const bundleManifest = {
    runtimeBundle,
    entryBundle,
    vendorBundle,
    scripts: [],
    cssModulesStyles,
    cssModulesBundle,
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
    hashes = hashes.concat([assets[`${key}.js`], assets[`${key}.css`]]).filter(Boolean);
  });

  const bundles = getLoadableBundles(loadableBundles.bundles, modules);

  const cssBundles = bundles.filter(b => b.file.endsWith('.css') && !hashes.includes(b.publicPath));
  bundleManifest.styles = [...new Set(cssBundles.map(b => b.publicPath))];

  const jsBundles = bundles.filter(
    b =>
      b?.file?.endsWith('.js') &&
      !b.file.endsWith('.hot-update.js') &&
      !hashes.includes(b.publicPath)
  );
  bundleManifest.scripts = [...new Set(jsBundles.map(b => b.publicPath))];

  return bundleManifest;
};
