import logger from 'kyt-utils/logger';
import shell from 'shelljs';
import { createDir, installUserDependencies, copyStarterKytFiles } from '../utils';

jest.mock('fs', () => ({
  writeFileSync: () => {},
}));

jest.mock('shelljs', () => ({
  test: jest.fn(),
  mv: () => ({ code: 0 }),
  mkdir: jest.fn(() => ({ code: 0 })),
  cp: () => ({ code: 0 }),
  cd: jest.fn(() => ({ code: 0 })),
  exec: jest.fn(() => ({ code: 0 })),
}));

jest.mock('kyt-utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  task: jest.fn(),
}));

const tmpDir = '/path/to/temp';
const userRootPath = '/path/to/repo';
const userPackageJSONPath = `${userRootPath}/package.json`;

describe('utils', () => {
  beforeEach(() => {
    logger.info.mockReset();
    logger.error.mockReset();
    logger.task.mockReset();
    shell.test.mockReset();
  });

  describe('createDir', () => {
    test('empty dirName', () => {
      createDir('');

      expect(logger.task).not.toHaveBeenCalled();
    });

    test('dirName', () => {
      createDir('foo');

      expect(logger.task).toHaveBeenCalled();
    });

    test('dirName exits', () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementationOnce(() => {});
      shell.cd.mockImplementationOnce(() => ({ code: 1 }));

      createDir('foo');

      expect(logger.task).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalled();
    });
  });

  describe('installUserDependencies', () => {
    test('success', () => {
      const bail = jest.fn();
      installUserDependencies({ userPackageJSONPath }, 'npm', {}, bail);

      expect(logger.error).not.toHaveBeenCalled();
      expect(bail).not.toHaveBeenCalled();
    });

    test('failure', () => {
      shell.exec.mockImplementationOnce(() => ({ code: 1 }));

      const bail = jest.fn();
      installUserDependencies({ userPackageJSONPath }, 'npm', {}, bail);

      expect(logger.error).toHaveBeenCalled();
      expect(bail).toHaveBeenCalled();
    });
  });

  describe('copyStarterKytFiles', () => {
    const files = ['.babelrc.js', 'foo.css', 'bar.xml', 'baz.js'];

    test('with no config', () => {
      copyStarterKytFiles({ userRootPath }, {}, tmpDir);

      expect(logger.task).not.toHaveBeenCalled();
    });

    test('with no files', () => {
      copyStarterKytFiles({ userRootPath }, { kyt: {} }, tmpDir);

      expect(logger.task).not.toHaveBeenCalled();
    });

    test('with empty files', () => {
      copyStarterKytFiles({ userRootPath }, { kyt: { files: [] } }, tmpDir);

      expect(logger.task).not.toHaveBeenCalled();
    });

    test('with no backups', () => {
      copyStarterKytFiles({ userRootPath }, { kyt: { files } }, tmpDir);

      expect(logger.info).not.toHaveBeenCalled();
      expect(logger.task).toHaveBeenCalled();
    });

    test('with backups', () => {
      shell.test.mockImplementation((flag, filePath) => {
        if (filePath.endsWith('.babelrc.js')) {
          return true;
        }
        return false;
      });

      copyStarterKytFiles({ userRootPath }, { kyt: { files } }, tmpDir);

      expect(logger.info).toHaveBeenCalled();
      expect(logger.task).toHaveBeenCalled();
    });
  });
});
