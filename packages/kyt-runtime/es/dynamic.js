const { Loadable } = require('./loadable');

function Loading() {
  return null;
}

function dynamic(loader, opts = {}) {
  const options = { ...opts, ...opts.loadableGenerated };
  delete options.loadableGenerated;
  options.loader = loader;
  if (!options.loading) {
    options.loading = Loading;
  }

  return Loadable(options);
}

module.exports = dynamic;
