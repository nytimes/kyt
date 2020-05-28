const path = require('path');
const jestPreset = require('jest-preset-kyt-enzyme');

const colors = [
  'magentaBright',
  'cyanBright',
  'greenBright',
  'yellowBright',
  'redBright',
  'blueBright',
  'blackBright',
  'magenta',
  'cyan',
  'green',
  'yellow',
  'red',
  'blue',
  'black',
];

const testPathIgnorePatterns = [
  '<rootDir>/packages/kyt-starter-*',
  '<rootDir>/packages/kyt-core/cli/actions/test.js',
  '<rootDir>/e2e_tests',
];

const coveragePathIgnorePatterns = [
  '<rootDir>/node_modules',
  '<rootDir>/packages/*/node_modules',
  '<rootDir>/packages/kyt-starter-*',
  '<rootDir>/coverage',
];

// for projects that use styled components, include the `pretty-lights` serializer
const snapshotSerializers = [...jestPreset.snapshotSerializers, 'pretty-lights/jest'];

const projects = {
  'babel-preset-kyt-core': {
    enzyme: {},
  },
  'kyt-core': {
    enzyme: {},
  },
  'kyt-starter-server/starter-src': {
    enzyme: {},
    styled: {},
  },
  'kyt-starter-static/starter-src': {
    enzyme: {},
    styled: {},
  },
  'kyt-starter-universal/starter-src': {
    enzyme: {},
    styled: {},
  },
  'kyt-utils': {
    enzyme: {},
  },
};

const jestConfig = {
  testPathIgnorePatterns,
  collectCoverageFrom: ['**/*.js'],
  coveragePathIgnorePatterns,
  // dynamically create `projects` entries
  projects: Object.entries(projects).reduce((configs, [name, config], idx) => {
    const rootDir = path.join(__dirname, `packages/${name}`);
    const color = colors[idx];
    if (config.enzyme) {
      const base = {
        name: `jest:${name}`,
        displayName: { name: 'jest', color },
        preset: 'jest-preset-kyt-enzyme',
        rootDir,
        testPathIgnorePatterns,
        cacheDirectory: path.join(__dirname, `.caches/${name}/jest`),
      };

      if (config.styled) {
        base.snapshotSerializers = snapshotSerializers;
      }

      let merged = base;
      if (Object.keys(config.enzyme).length > 0) {
        merged = { ...base, ...config.enzyme };
      }

      configs.push(merged);
    }
    if (config.styled) {
      const base = {
        name: `style:${name}`,
        displayName: { name: 'style', color },
        preset: 'jest-preset-kyt-styled',
        rootDir,
        testPathIgnorePatterns: testPathIgnorePatterns.concat('/__tests__/'),
        cacheDirectory: path.join(__dirname, `.caches/${name}/style`),
      };

      let merged = base;
      if (Object.keys(config.styled).length > 0) {
        merged = { ...base, ...config.styled };
      }

      configs.push(merged);
    }
    return configs;
  }, []),
};

if (process.env.CI) {
  jestConfig.coverageReporters = ['lcov', 'text-summary'];
  jestConfig.reporters = [[require.resolve('jest-silent-reporter'), { useDots: true }]];
}

module.exports = jestConfig;
