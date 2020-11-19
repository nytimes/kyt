// Implementation of this PR: https://github.com/jamiebuilds/react-loadable/pull/132
// Modified to strip out unneeded results for kyt's specific use case

const url = require('url');
const path = require('path');
const webpack = require('webpack');

const { RawSource } = webpack.sources;

function getModulesIterable(compilation, chunk) {
  return compilation.chunkGraph.getChunkModulesIterable(chunk);
}

function getModuleId(compilation, module) {
  compilation.chunkGraph.getModuleId(module);
}

function buildManifest(compiler, compilation) {
  const manifest = {
    entries: Array.from(compilation.entrypoints.keys()),
    bundles: {},
  };

  compilation.chunkGroups.forEach(chunkGroup => {
    if (chunkGroup.isInitial()) {
      return;
    }

    chunkGroup.origins.forEach(chunkGroupOrigin => {
      const { request } = chunkGroupOrigin;

      chunkGroup.chunks.forEach(chunk => {
        chunk.files.forEach(file => {
          if (!file.endsWith('.js')) {
            return;
          }

          const publicPath = url.resolve(compilation.outputOptions.publicPath || '', file);

          // eslint-disable-next-line no-restricted-syntax
          for (const module of getModulesIterable(compilation, chunk)) {
            const id = getModuleId(compilation, module);

            if (!manifest.bundles[request]) {
              manifest.bundles[request] = [];
            }

            // Avoid duplicate files
            if (manifest.bundles[request].some(item => item.id === id && item.file === file)) {
              // eslint-disable-next-line no-continue
              continue;
            }

            manifest.bundles[request].push({ id, file, publicPath });
          }
        });
      });
    });
  });

  manifest.bundles = Object.keys(manifest.bundles)
    .sort()
    .reduce((a, c) => {
      a[c] = manifest.bundles[c];
      return a;
    }, {});

  return manifest;
}

class LoadablePlugin {
  constructor(opts = {}) {
    this.filename = path.basename(opts.filename);
  }

  createAssets(compiler, compilation, assets) {
    const manifest = buildManifest(compiler, compilation);
    assets[this.filename] = new RawSource(JSON.stringify(manifest, null, 2));
    return assets;
  }

  apply(compiler) {
    compiler.hooks.make.tap('LoadableManifest', compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: 'LoadableManifest',
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        assets => {
          this.createAssets(compiler, compilation, assets);
        }
      );
    });
  }
}

function getBundles(manifest, moduleIds) {
  return moduleIds.reduce((bundles, moduleId) => {
    return bundles.concat(manifest[moduleId]);
  }, []);
}

exports.LoadablePlugin = LoadablePlugin;
exports.getBundles = getBundles;
