const fs = require('fs');
const Loadable = require('react-loadable');
const { getBundles } = require('react-loadable/webpack');
const {
  clientAssetsFile,
  loadableAssetsFile,
  publicSrcPath,
  publicBuildPath,
} = require('kyt-utils/paths')();

exports.preloadDynamicImports = Loadable.preloadAll;

exports.DynamicImports = Loadable.Capture;

exports.publicDirPath = {
  src: publicSrcPath,
  build: publicBuildPath,
};

exports.getClientAssets = () => {
  const assetJSON = fs.readFileSync(clientAssetsFile);
  return JSON.parse(assetJSON);
};

exports.getLoadableBundles = modules => {
  let scripts = [];
  let styles = [];
  if (!modules || modules.length === 0) {
    return { styles, scripts };
  }
  const loadableStats = fs.readFileSync(loadableAssetsFile);
  const loadableBundles = JSON.parse(loadableStats);
  const bundles = getBundles(loadableBundles, modules);
  const cssBundles = bundles.filter(bundle => bundle.file.endsWith('.css'));
  styles = [...new Set(cssBundles.map(b => b.publicPath))];
  const jsBundles = bundles.filter(bundle => bundle.file.endsWith('.js'));
  scripts = [...new Set(jsBundles.map(b => b.publicPath))];
  return { styles, scripts };
};
