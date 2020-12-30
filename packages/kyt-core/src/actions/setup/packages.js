const fs = require('fs');
const semver = require('semver');
const shell = require('shelljs');
const logger = require('kyt-utils/logger');

export const fakePackageJson = {
  name: '',
  version: '1.0.0',
  description: '',
  main: '',
  author: '',
  license: '',
};

// Add kyt to list of dev dependencies if its not there
export const addKytDependency = (packageJson, kytPrefVersion) => {
  // check to see if kyt is in dependencies or devDependencies
  if (
    !(packageJson.dependencies && packageJson.dependencies.kyt) &&
    !(packageJson.devDependencies && packageJson.devDependencies.kyt)
  ) {
    let kytVersion = kytPrefVersion;
    // If a version wasn't specified, install latest
    if (!kytVersion) {
      const output = shell.exec('npm info kyt version');
      kytVersion = output.stdout.trim();
    }

    if (packageJson.dependencies && packageJson.dependencies.kyt) {
      delete packageJson.dependencies.kyt;
    }
    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.devDependencies.kyt = kytVersion;
  }
  return packageJson;
};

// Adds kyt and Starter-kyt commands as npm scripts
export const addPackageJsonScripts = (packageJson, tempPackageJSON) => {
  if (!packageJson.scripts) packageJson.scripts = {};
  // for commands that aren't 1:1 name:script
  const commandMap = {
    dev: 'kyt dev',
    build: 'kyt build',
    start: 'node build/server/main.js',
    'kyt:help': 'kyt --help',
  };

  // Merge the Starter-kyt script names into the list of commands.
  let tempScripts = (tempPackageJSON && tempPackageJSON.kyt && tempPackageJSON.kyt.scripts) || [];
  if (tempScripts.length) {
    logger.error(
      'Use of`kyt.scripts` is deprecated in `package.json`. You can simply declare `scripts`.'
    );
    process.exit(1);
  }

  tempScripts = (tempPackageJSON && tempPackageJSON.scripts) || {};

  const commands = [...new Set([...Object.keys(commandMap), ...Object.keys(tempScripts)])].sort();
  commands.forEach(command => {
    // If the command is from a starter-kyt then
    // we need to copy in the starter-kyt value.
    if (tempScripts[command]) {
      packageJson.scripts[command] = tempScripts[command];
    } else if (!packageJson.scripts[command]) {
      packageJson.scripts[command] = commandMap[command];
    }
  });
  logger.task('Added kyt scripts into your package.json scripts');
  return packageJson;
};

// Compare the starter-kyt's package.json kyt.version
// configuration to make sure kyt is an expected version.
export const checkStarterKytVersion = (userPackageJSON, tempPackageJSON) => {
  const kytStarterPreferredVersion =
    (tempPackageJSON.dependencies && tempPackageJSON.dependencies.kyt) ||
    (tempPackageJSON.devDependencies && tempPackageJSON.devDependencies.kyt) ||
    null;
  if (kytStarterPreferredVersion) {
    // Look everywhere for kyt
    const kytVersion =
      (userPackageJSON.devDependencies && userPackageJSON.devDependencies.kyt) ||
      (userPackageJSON.dependencies && userPackageJSON.dependencies.kyt);
    if (semver.valid(kytVersion)) {
      if (!semver.satisfies(kytVersion, kytStarterPreferredVersion)) {
        logger.warn(
          `${tempPackageJSON.name} requires kyt version ${kytStarterPreferredVersion} but kyt ${kytVersion} is installed.`
        );
      }
    }
  }
  return kytStarterPreferredVersion;
};

// Adds dependencies from the starter-kyts package.json
export const updatePackageJSONDependencies = (packageJson, tempPackageJSON) => {
  ['resolutions', 'dependencies', 'devDependencies'].forEach(key => {
    if (!packageJson[key] && !tempPackageJSON[key]) {
      return;
    }
    const deps = {};
    [
      ...new Set([
        ...Object.keys(packageJson[key] || {}),
        ...Object.keys(tempPackageJSON[key] || {}),
      ]),
    ]
      .sort()
      .forEach(depKey => {
        deps[depKey] =
          (tempPackageJSON[key] && tempPackageJSON[key][depKey]) ||
          (packageJson[key] && packageJson[key][depKey]);
      });
    packageJson[key] = deps;
  });

  logger.task('Added new dependencies to package.json');

  return packageJson;
};

// Add dependencies, scripts and other package to
// the user's package.json configuration.

export const updateUserPackageJSON = (existingProject, paths, kytVersion, tempPackageJSON) => {
  let userPackageJSON;
  // Create a package.json definition if
  // the user doesn't already have one.
  if (shell.test('-f', paths.userPackageJSONPath)) {
    const userJSON = fs.readFileSync(paths.userPackageJSONPath, 'utf8');
    userPackageJSON = JSON.parse(userJSON);
  } else {
    userPackageJSON = fakePackageJson;
    logger.task('Creating a new package.json. You should fill it in.');
  }
  // Clone the package.json so that we have a backup.
  const oldPackageJSON = { ...userPackageJSON };
  let kytPrefVersion = kytVersion;

  // Add dependencies from starter-kyts
  if (!existingProject) {
    kytPrefVersion = kytVersion || checkStarterKytVersion(userPackageJSON, tempPackageJSON);
    userPackageJSON = updatePackageJSONDependencies(userPackageJSON, tempPackageJSON);
  }
  userPackageJSON = addKytDependency(userPackageJSON, kytPrefVersion);
  userPackageJSON = addPackageJsonScripts(userPackageJSON, tempPackageJSON);
  fs.writeFileSync(paths.userPackageJSONPath, JSON.stringify(userPackageJSON, null, 2));

  return { oldPackageJSON, userPackageJSON };
};
