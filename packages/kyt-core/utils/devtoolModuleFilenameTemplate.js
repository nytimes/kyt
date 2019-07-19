// source map customizations
// references in a source map's "sources" property are relative and need to resolve differently based on the context

const path = require('path');
const { serverSrcPath } = require('kyt-utils/paths')();

// configure for debugging locally (via `npm run dev-inspect` and attaching a debugger to that process)
// in the local debugging context, source map sources need to resolve relative to the
// source's location on disk ... here, we make sure to account for the `./build/server` target destination
// for example:
// given the file `$HOME/project/src/server/metricsHandler.js`, the path in `build/server/main.js.map`'s "sources" property for this file
// should be `../../src/server/metricsHandler.js`
//
// dynamically set the source map's "sources" paths
module.exports = info => {
  const { resourcePath, absoluteResourcePath } = info;
  // skip these
  if (/^(webpack|external)/.test(resourcePath)) {
    return `${resourcePath}`;
  }
  // return a relative path that resolves according to the debugging context
  return path.relative(serverSrcPath, absoluteResourcePath);
};
