module.exports = {
  cliOptions: {
    cache: true,
    cacheLocation: '.caches/eslint',
    ext: ['.js', '.json'],
    fix: !!process.env.ESLINT_FIX,
    quiet: !!process.env.ESLINT_QUIET,
    reportUnusedDisableDirectives: true,
  },
};
