const fs = require('fs');
const semver = require('semver');
const shell = require('shelljs');
const cloneDeep = require('lodash.clonedeep');
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
export const addKytDependency = (packageJSON, kytPrefVersion) => {
  // check to see if kyt is in dependencies or devDependencies
  if (
    !(packageJSON.dependencies && packageJSON.dependencies.kyt) &&
    !(packageJSON.devDependencies && packageJSON.devDependencies.kyt)
  ) {
    let kytVersion = kytPrefVersion;
    // If a version wasn't specified, install latest
    if (!kytVersion) {
      const output = shell.exec('npm info kyt version');
      kytVersion = output.stdout.trim();
    }

    if (packageJSON.dependencies && packageJSON.dependencies.kyt) {
      delete packageJSON.dependencies.kyt;
    }
    packageJSON.devDependencies = packageJSON.devDependencies || {};
    packageJSON.devDependencies.kyt = kytVersion;
  }
  return packageJSON;
};

// Adds kyt and Starter-kyt commands as npm scripts
export const addPackageJsonScripts = (
  userPackageJSON,
  starterPackageJSON,
  starterKytConfig = {}
) => {
  if (!userPackageJSON.scripts) {
    userPackageJSON.scripts = {};
  }
  // for commands that aren't 1:1 name:script
  const commandMap = {
    dev: 'kyt dev',
    build: 'kyt build',
    'kyt:help': 'kyt --help',
  };

  if (starterKytConfig.hasServer !== false) {
    commandMap.start = 'node build/server/main.js';
  }

  const deprecatedConfig = starterPackageJSON?.kyt?.scripts || [];
  if (deprecatedConfig && deprecatedConfig.length > 0) {
    logger.error(
      'Use of`kyt.scripts` is deprecated in `package.json`. You can simply declare `scripts`.'
    );
    process.exit(1);
  }

  const starterScripts = (starterPackageJSON && starterPackageJSON.scripts) || {};

  // Merge the Starter-kyt script names into the list of commands.
  const keys = [...Object.keys(commandMap), ...Object.keys(starterScripts)];
  const commands = new Set(keys);
  commands.forEach(command => {
    // If the command is from a starter-kyt then
    // we need to copy in the starter-kyt value.
    if (starterScripts[command]) {
      userPackageJSON.scripts[command] = starterScripts[command];
    } else if (!userPackageJSON.scripts[command]) {
      userPackageJSON.scripts[command] = commandMap[command];
    }
  });
  logger.task('Added kyt scripts into your package.json scripts');
  return userPackageJSON;
};

// Compare the starter-kyt's package.json kyt.version
// configuration to make sure kyt is an expected version.
export const checkStarterKytVersion = (userPackageJSON, starterPackageJSON) => {
  const kytStarterPreferredVersion =
    (starterPackageJSON.dependencies && starterPackageJSON.dependencies.kyt) ||
    (starterPackageJSON.devDependencies && starterPackageJSON.devDependencies.kyt) ||
    null;
  if (kytStarterPreferredVersion) {
    // Look everywhere for kyt
    const kytVersion =
      (userPackageJSON.devDependencies && userPackageJSON.devDependencies.kyt) ||
      (userPackageJSON.dependencies && userPackageJSON.dependencies.kyt);
    if (semver.valid(kytVersion)) {
      if (!semver.satisfies(kytVersion, kytStarterPreferredVersion)) {
        logger.warn(
          `${starterPackageJSON.name} requires kyt version ${kytStarterPreferredVersion} but kyt ${kytVersion} is installed.`
        );
      }
    }
  }
  return kytStarterPreferredVersion;
};

// Adds dependencies from the starter-kyts package.json
export const updatePackageJSONDependencies = (packageJSON, starterPackageJSON) => {
  ['resolutions', 'dependencies', 'devDependencies'].forEach(key => {
    if (!packageJSON[key] && !starterPackageJSON[key]) {
      return;
    }
    const deps = {};
    const keys = new Set([
      ...Object.keys(packageJSON[key] || {}),
      ...Object.keys(starterPackageJSON[key] || {}),
    ]);
    keys.forEach(depKey => {
      deps[depKey] =
        (starterPackageJSON[key] && starterPackageJSON[key][depKey]) ||
        (packageJSON[key] && packageJSON[key][depKey]);
    });
    packageJSON[key] = deps;
  });

  logger.task('Added new dependencies to package.json');

  return packageJSON;
};

// Add dependencies, scripts and other package to
// the user's package.json configuration.

export const updateUserPackageJSON = (starterPackageJSON, starterKytConfig, paths, kytVersion) => {
  let newUserPackageJSON;
  // Create a package.json definition if
  // the user doesn't already have one.
  if (shell.test('-f', paths.userPackageJSONPath)) {
    const userJSON = fs.readFileSync(paths.userPackageJSONPath, 'utf8');
    newUserPackageJSON = JSON.parse(userJSON);
  } else {
    newUserPackageJSON = cloneDeep(fakePackageJson);
    logger.task('Creating a new package.json. You should fill it in.');
  }
  // Clone the package.json so that we have a backup.
  const oldUserPackageJSON = cloneDeep(newUserPackageJSON);

  // Add dependencies from starter-kyts
  const kytPrefVersion =
    kytVersion || checkStarterKytVersion(newUserPackageJSON, starterPackageJSON);
  newUserPackageJSON = updatePackageJSONDependencies(newUserPackageJSON, starterPackageJSON);
  newUserPackageJSON = addKytDependency(newUserPackageJSON, kytPrefVersion);
  newUserPackageJSON = addPackageJsonScripts(
    newUserPackageJSON,
    starterPackageJSON,
    starterKytConfig
  );
  fs.writeFileSync(paths.userPackageJSONPath, JSON.stringify(newUserPackageJSON, null, 2));

  return { oldUserPackageJSON, newUserPackageJSON };
};
