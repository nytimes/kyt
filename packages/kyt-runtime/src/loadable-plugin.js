// Implementation of this PR: https://github.com/jamiebuilds/react-loadable/pull/132
// Modified to strip out unneeded results for kyt's specific use case

const fs = require('fs');
const path = require('path');
const url = require('url');

function ignoreModule(name, vendorTest, ignoreModuleTest) {
  if (name && ignoreModuleTest) {
    if (typeof ignoreModuleTest === 'function') {
      if (ignoreModuleTest({ resource: name })) {
        return true;
      }
    } else if (ignoreModuleTest.test(name)) {
      return true;
    }
  } else if (name && vendorTest) {
    if (typeof vendorTest === 'function') {
      if (vendorTest({ resource: name })) {
        return true;
      }
    } else if (vendorTest.test(name)) {
      return true;
    }
  } else if (name && name.match(/node_modules/)) {
    return true;
  }
  return false;
}

function buildManifest(compiler, compilation, opts) {
  const { context, optimization } = compiler.options;
  const vendorTest = optimization?.splitChunks?.cacheGroups?.vendor?.test;
  const { ignoreModuleTest } = opts;
  const manifest = {
    entries: Array.from(compilation.entrypoints.keys()),
    bundles: {},
  };

  compilation.chunks.forEach(chunk => {
    chunk.files.forEach(file => {
      if (!file.match(/\.js$/)) {
        return;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const module of chunk.modulesIterable) {
        const { id } = module;
        const name = typeof module.libIdent === 'function' ? module.libIdent({ context }) : null;

        if (ignoreModule(name, vendorTest, ignoreModuleTest)) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const publicPath = url.resolve(compilation.outputOptions.publicPath || '', file);

        let currentModule = module;
        if (module.constructor.name === 'ConcatenatedModule') {
          currentModule = module.rootModule;
        }

        if (
          !currentModule.rawRequest ||
          currentModule.rawRequest.match(
            /\.(scss|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico)$/
          )
        ) {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (!manifest.bundles[currentModule.rawRequest]) {
          manifest.bundles[currentModule.rawRequest] = [];
        }

        manifest.bundles[currentModule.rawRequest].push({
          id,
          name,
          file,
          publicPath,
        });
      }
    });
  });

  return manifest;
}

export class LoadablePlugin {
  constructor(opts = {}) {
    this.filename = opts.filename;
    this.ignoreModuleTest = null;
  }

  setIgnoreModuleTest(test) {
    this.ignoreModuleTest = test;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('LoadableManifest', (compilation, callback) => {
      const manifest = buildManifest(compiler, compilation, {
        ignoreModuleTest: this.ignoreModuleTest,
      });
      const json = JSON.stringify(manifest, null, 2);
      const outputDirectory = path.dirname(this.filename);
      try {
        fs.mkdirSync(outputDirectory);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err;
        }
      }
      fs.writeFileSync(this.filename, json);
      callback();
    });
  }
}

export function getBundles(manifest, moduleIds) {
  return moduleIds.reduce((bundles, moduleId) => {
    if (manifest[moduleId]) {
      bundles.push(manifest[moduleId]);
    }
    return bundles;
  }, []);
}
