import { Loadable } from './loadable';

function Loading() {
  return null;
}

module.exports = function dynamic(loader, opts = {}) {
  const options = { ...opts, ...opts.loadableGenerated };
  delete options.loadableGenerated;
  options.loader = loader;
  if (!options.loading) {
    options.loading = Loading;
  }

  return Loadable(options);
};
