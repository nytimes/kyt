import fs from 'fs';
import shell from 'shelljs';
import logger from 'kyt-utils/logger';
import {
  addKytDependency,
  addPackageJsonScripts,
  checkStarterKytVersion,
  updatePackageJSONDependencies,
  updateUserPackageJSON,
} from '../packages';

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
}));

jest.mock('shelljs', () => ({
  test: jest.fn(),
  exec: jest.fn(() => ({ code: 0 })),
}));

jest.mock('kyt-utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  task: jest.fn(),
  warn: jest.fn(),
}));

const userRootPath = '/path/to/repo';
const userPackageJSONPath = `${userRootPath}/package.json`;

describe('packages', () => {
  beforeEach(() => {
    fs.writeFileSync.mockReset();
    fs.readFileSync.mockReset();
    logger.info.mockReset();
    logger.error.mockReset();
    logger.task.mockReset();
    logger.warn.mockReset();
    shell.exec.mockReset();
  });

  describe('addKytDependency', () => {
    test('has dep', () => {
      const result = addKytDependency({ dependencies: { kyt: '*' } });

      expect(result.dependencies.kyt).toEqual('*');
      expect(result.devDependencies).toBeUndefined();
    });

    test('has devDep', () => {
      const result = addKytDependency({ devDependencies: { kyt: '*' } });

      expect(result.devDependencies.kyt).toEqual('*');
      expect(result.dependencies).toBeUndefined();
    });

    test('has no kyt', () => {
      const result = addKytDependency({}, '1.0.0');

      expect(result.devDependencies.kyt).toEqual('1.0.0');
      expect(result.dependencies).toBeUndefined();
    });

    test('has no kyt or preference', () => {
      shell.exec.mockImplementationOnce(() => ({
        stdout: '2.2.2',
      }));

      const result = addKytDependency({});

      expect(result.devDependencies.kyt).toEqual('2.2.2');
      expect(result.dependencies).toBeUndefined();
    });
  });

  describe('addPackageJsonScripts', () => {
    test('no scripts', () => {
      const result = addPackageJsonScripts({});

      expect(result.scripts).toMatchSnapshot();
      expect(logger.task).toHaveBeenCalled();
    });

    test('scripts', () => {
      const result = addPackageJsonScripts({ scripts: { test: 'jest', foo: 'bar' } });

      expect(result.scripts).toMatchSnapshot();
      expect(logger.task).toHaveBeenCalled();
    });

    test('no scripts + temp scripts + deprecated', () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

      addPackageJsonScripts({}, { scripts: { foo: 'bar' }, kyt: { scripts: ['foo'] } });

      expect(mockExit).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    test('scripts + temp scripts', () => {
      const result = addPackageJsonScripts(
        { scripts: { foo: 'bar' } },
        { scripts: { foo: 'baz' } }
      );

      expect(result.scripts).toEqual(expect.objectContaining({ foo: 'baz' }));
      expect(logger.task).toHaveBeenCalled();
    });
  });

  describe('checkStarterKytVersion', () => {
    test('no preferred dep', () => {
      const result = checkStarterKytVersion({}, { dependencies: {} });

      expect(result).toBeNull();
    });

    test('no preferred devDep', () => {
      const result = checkStarterKytVersion({}, { devDependencies: {} });

      expect(result).toBeNull();
    });

    test('preferred dep', () => {
      const result = checkStarterKytVersion({}, { dependencies: { kyt: '1.0.0' } });

      expect(result).toBe('1.0.0');
    });

    test('preferred devDep', () => {
      const result = checkStarterKytVersion({}, { devDependencies: { kyt: '1.0.0' } });

      expect(result).toBe('1.0.0');
    });

    test('preferred dep + both set', () => {
      const result = checkStarterKytVersion(
        { devDependencies: { kyt: '^1.0.0' } },
        { dependencies: { kyt: '1.0.3' } }
      );

      expect(result).toBe('1.0.3');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    test('preferred devDep + both set', () => {
      const result = checkStarterKytVersion(
        { dependencies: { kyt: '^1.0.0' } },
        { devDependencies: { kyt: '1.0.3' } }
      );

      expect(result).toBe('1.0.3');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    test('preferred dep + both set + warning', () => {
      const result = checkStarterKytVersion(
        { devDependencies: { kyt: '0.0.2' } },
        { dependencies: { kyt: '1.0.0' } }
      );

      expect(result).toBe('1.0.0');
      expect(logger.warn).toHaveBeenCalled();
    });

    test('preferred devDep + both set + warning', () => {
      const result = checkStarterKytVersion(
        { dependencies: { kyt: '0.0.2' } },
        { devDependencies: { kyt: '1.0.0' } }
      );

      expect(result).toBe('1.0.0');
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  describe('updatePackageJSONDependencies', () => {
    test('merge', () => {
      const result = updatePackageJSONDependencies(
        { dependencies: { react: '1' } },
        { dependencies: { react: '2' } }
      );

      expect(result).toEqual({ dependencies: { react: '2' } });
      expect(result.resolutions).toBeUndefined();
    });

    test('duplicates allowed', () => {
      const result = updatePackageJSONDependencies(
        { dependencies: { react: '1' } },
        { devDependencies: { react: '2' } }
      );

      expect(result).toEqual({ dependencies: { react: '1' }, devDependencies: { react: '2' } });
      expect(result.resolutions).toBeUndefined();
    });

    test('resolutions merged', () => {
      const result = updatePackageJSONDependencies(
        { dependencies: { react: '1' } },
        { devDependencies: { react: '2' }, resolutions: { react: '2' } }
      );

      expect(result).toEqual({
        resolutions: { react: '2' },
        dependencies: { react: '1' },
        devDependencies: { react: '2' },
      });
    });
  });

  describe('updateUserPackageJSON', () => {
    test('existing packagejson', () => {
      shell.test.mockImplementationOnce(() => true);
      fs.readFileSync.mockImplementationOnce(() =>
        JSON.stringify(
          {
            name: 'foo',
            version: '3.1.0',
            description: 'a repo',
            main: 'index.js',
            author: 'baz',
            license: 'MIT',
          },
          null,
          2
        )
      );

      const result = updateUserPackageJSON({ userPackageJSONPath }, '1.0.0', {});

      expect(result).toMatchSnapshot();
    });

    test('no existing packagejson', () => {
      shell.test.mockImplementationOnce(() => false);

      const result = updateUserPackageJSON({ userPackageJSONPath }, '1.0.0', {});

      expect(result).toMatchSnapshot();
    });

    test('not existing + no pref', () => {
      shell.test.mockImplementationOnce(() => false);
      shell.exec.mockImplementationOnce(() => ({ stdout: '0.3.0' }));

      const result = updateUserPackageJSON({ userPackageJSONPath }, undefined, {});

      expect(result).toMatchSnapshot();
    });
  });
});
