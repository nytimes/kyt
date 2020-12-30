const fs = require('fs');
const semver = require('semver');
const shell = require('shelljs');
const logger = require('kyt-utils/logger');
const { fakePackageJson } = require('./utils');

// Add kyt to list of dev dependencies if its not there
const addKytDependency = (packageJson, kytPrefVersion) => {
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
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.dependencies.kyt = kytVersion;
  }
};

// Adds kyt and Starter-kyt commands as npm scripts
const addPackageJsonScripts = (packageJson, tempPackageJSON) => {
  if (!packageJson.scripts) packageJson.scripts = {};
  let commands = [
    'dev',
    'build',
    'start',
    'test',
    'test-update',
    'test-watch',
    'test-coverage',
    'lint',
    'lint-fix',
  ];

  // for commands that aren't 1:1 name:script
  const commandMap = {
    start: 'node build/server/main.js',
  };

  // Merge the Starter-kyt script names into the list of commands.
  const tempScripts = (tempPackageJSON && tempPackageJSON.kyt && tempPackageJSON.kyt.scripts) || [];
  if (tempScripts.length) {
    commands = [...new Set(commands.concat(tempScripts))];
  }

  // This is the default test script added by 'npm init'.
  const npmInitDefaultTestScript = 'echo "Error: no test specified" && exit 1';

  commands.forEach(command => {
    let commandName = command;

    // If the command already exists, we namespace it with "kyt:".
    if (packageJson.scripts[commandName]) {
      // We don't need to prefix if the command already
      // runs kyt and it's not a Starter-kyt script.
      if (packageJson.scripts[commandName].includes('kyt') && !tempScripts.indexOf(command)) {
        return;
      }

      // Prefix except for when the command is 'test' and the script is
      // the default from 'npm init'.
      if (commandName !== 'test' || packageJson.scripts[commandName] !== npmInitDefaultTestScript) {
        commandName = `kyt:${commandName}`;
      }
    }

    // If the command is from a starter-kyt then
    // we need to copy in the starter-kyt value.
    if (tempScripts.indexOf(command) > -1) {
      packageJson.scripts[commandName] = tempPackageJSON.scripts[command];
    } else {
      packageJson.scripts[commandName] = commandMap[command] || `kyt ${command}`;
    }
  });
  packageJson.scripts['kyt:help'] = 'kyt --help';
  logger.task('Added kyt scripts into your package.json scripts');
  return packageJson;
};

// Compare the starter-kyt's package.json kyt.version
// configuration to make sure kyt is an expected version.
const checkStarterKytVersion = (userPackageJSON, tempPackageJSON) => {
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
const updatePackageJSONDependencies = (packageJson, tempPackageJSON) => {
  const tempDependencies = tempPackageJSON.dependencies || {};
  const tempDevDependencies = tempPackageJSON.devDependencies || {};
  // In case the starter kyt used `kyt` as a dependency.
  if (tempDependencies.kyt) {
    delete tempDependencies.kyt;
  }
  if (tempDevDependencies.kyt) {
    delete tempDevDependencies.kyt;
  }

  packageJson.dependencies = Object.assign(packageJson.dependencies || {}, tempDependencies);

  // Copies over dev dependencies
  if (tempDevDependencies) {
    packageJson.devDependencies = Object.assign(
      packageJson.devDependencies || {},
      tempDevDependencies
    );
  }

  logger.task('Added new dependencies to package.json');
  return packageJson;
};

// Add dependencies, scripts and other package to
// the user's package.json configuration.

// eslint-disable-next-line import/prefer-default-export
export const updateUserPackageJSON = (existingProject, paths, kytVersion, tempPackageJSON) => {
  let userPackageJSON;
  // Create a package.json definition if
  // the user doesn't already have one.
  if (shell.test('-f', paths.userPackageJSONPath)) {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    userPackageJSON = require(paths.userPackageJSONPath);
  } else {
    userPackageJSON = fakePackageJson;
    logger.task('Creating a new package.json. You should fill it in.');
  }
  // Clone the package.json so that we have a backup.
  const oldPackageJSON = { ...userPackageJSON };

  // Add dependencies from starter-kyts
  if (!existingProject) {
    const kytPrefVersion = kytVersion || checkStarterKytVersion(userPackageJSON, tempPackageJSON);
    userPackageJSON = updatePackageJSONDependencies(userPackageJSON, tempPackageJSON);
    addKytDependency(userPackageJSON, kytPrefVersion);
  } else {
    // exisitng projects should also have kyt as a devDependency
    addKytDependency(userPackageJSON);
  }
  // Add scripts
  userPackageJSON = addPackageJsonScripts(userPackageJSON, tempPackageJSON);
  fs.writeFileSync(paths.userPackageJSONPath, JSON.stringify(userPackageJSON, null, 2));

  return { oldPackageJSON, userPackageJSON };
};
