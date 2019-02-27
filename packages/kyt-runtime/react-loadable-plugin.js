// Implementation of this PR: https://github.com/jamiebuilds/react-loadable/pull/132
// Modified to strip out unneeded results for kyt's specific use case

const fs = require('fs');
const path = require('path');
const url = require('url');

function buildManifest(compiler, compilation) {
  const { context } = compiler.options;
  const manifest = {};

  compilation.chunks.forEach(chunk => {
    chunk.files.forEach(file => {
      if (!file.match(/\.js$/)) {
        return;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const module of chunk.modulesIterable) {
        const { id } = module;
        const name = typeof module.libIdent === 'function' ? module.libIdent({ context }) : null;
        if (name && name.match(/node_modules/)) {
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
            /\.(css|scss|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico)$/
          )
        ) {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (!manifest[currentModule.rawRequest]) {
          manifest[currentModule.rawRequest] = [];
        }

        manifest[currentModule.rawRequest].push({ id, name, file, publicPath });
      }
    });
  });

  return manifest;
}

class ReactLoadablePlugin {
  constructor(opts = {}) {
    this.filename = opts.filename;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('ReactLoadableManifest', (compilation, callback) => {
      const manifest = buildManifest(compiler, compilation);
      var json = JSON.stringify(manifest, null, 2);
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

function getBundles(manifest, moduleIds) {
  return moduleIds.reduce((bundles, moduleId) => {
    return bundles.concat(manifest[moduleId]);
  }, []);
}

exports.ReactLoadablePlugin = ReactLoadablePlugin;
exports.getBundles = getBundles;
