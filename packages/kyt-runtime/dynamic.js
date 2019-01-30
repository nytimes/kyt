var Loadable = require('react-loadable');

function Loading() {
  return null;
}

function dynamic(loader, opts) {
  opts = opts || {};
  opts.loader = loader;
  if (!opts.loading) {
    opts.loading = Loading;
  }

  return Loadable(opts);
}

module.exports = dynamic;
