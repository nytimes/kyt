// Works similarly to webpack-node-externals but it's not as
// aggressive. It only excludes top-level dependency-declared
// modules. Respects an `allowList` of regexp's that will be
// used to match modules to include in the bundle.
const { userPackageJSONPath } = require('kyt-utils/paths')();

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(userPackageJSONPath);

module.exports = (allowList = []) => {
  // Get all of the dependencies from the package.json
  // and filter out the ones that are in the allowList
  const packageModules = [];
  Object.keys(pkg.dependencies || []).forEach(module => {
    allowList.forEach(allowedModule => {
      if (!allowedModule.test(module)) packageModules.push(module);
    });
  });

  return [
    // eslint-disable-next-line consistent-return
    (context, request, callback) => {
      function getModuleName(requested) {
        const scopedModuleRegex = new RegExp(
          '@[a-zA-Z0-9][\\w-.]+/[a-zA-Z0-9][\\w-.]+([a-zA-Z0-9./]+)?',
          'g'
        );
        const req = requested;
        const delimiter = '/';

        // Check if scoped module. For example: @company/boring-module
        if (scopedModuleRegex.test(req)) {
          // reset regexp
          scopedModuleRegex.lastIndex = 0;
          return req.split(delimiter, 2).join(delimiter);
        }
        return req.split(delimiter)[0];
      }
      if (packageModules.includes(getModuleName(request))) {
        // Mark this module as EXTERNAL
        return callback(null, `commonjs ${request}`);
      }
      // Include module in bundle / NOT EXTERNAL
      callback();
    },
  ];
};
