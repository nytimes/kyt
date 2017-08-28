#!/usr/bin/env node

// For each starter kyt, we're going to do the following:
//  - Move the node_modules directory because there is a wild bug when
//    installing when the lerna symlinks are present (I think it tries to
//    validate node_modules against pacakge-lock.json).
//  - Install all of the non-monorepo/kyt dependencies without fussing with
//    the package-lock and saving.
//  - Copy the lerna symlinks into the newly installed node_modules dir.

const execSync = require('child_process').execSync;
const path = require('path');

const repoPackages = {
  kyt: 'kyt-core',
  'babel-preset-kyt-react': 'babel-preset-kyt-react',
  'babel-preset-kyt-core': 'babel-preset-kyt-core',
  'kyt-starter-universal': 'kyt-starter-universal',
  'kyt-starter-static': 'kyt-starter-static',
};

// Get the paths to the starter kyt source directories.
const starterSources = Object.keys(repoPackages).reduce((starters, pkg) => {
  if (pkg.startsWith('kyt-starter')) starters.push(`${pkg}/starter-src`);
  return starters;
}, []);

starterSources.forEach(starter => {
  const pkgJSONPath = path.join(__dirname, `../packages/${starter}/package.json`);
  const cwd = `packages/${starter}`;
  // eslint-disable-next-line
  const pkgJSON = require(pkgJSONPath);
  const dependencies = Object.assign({}, pkgJSON.dependencies, pkgJSON.devDependencies);
  const installDeps = Object.keys(dependencies).reduce(
    (deps, dep) => (repoPackages[dep] ? deps : `${deps} ${dep}@${dependencies[dep]}`),
    ''
  );

  console.log(`Installing ${starter}`, installDeps);
  execSync('mv node_modules bro_modules', { cwd });
  execSync(`npm install ${installDeps} --no-save --no-package-lock`, { cwd });
  execSync('cp -R bro_modules/* node_modules/', { cwd });
  execSync('cp -R bro_modules/.bin/* node_modules/.bin/', { cwd });
  execSync('rm -rf bro_modules', { cwd });
});
