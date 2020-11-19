import { Loadable } from './loadable';

function Loading() {
  return null;
}

export default function dynamic(loader, opts = {}) {
  const options = { ...opts, ...opts.loadableGenerated };
  delete options.loadableGenerated;
  options.loader = loader;
  if (!options.loading) {
    options.loading = Loading;
  }

  return Loadable(options);
}
