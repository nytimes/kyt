import logger from 'kyt-utils/logger';
import shell from 'shelljs';
import {
  createDir,
  createSrcDirectory,
  createEditorconfigLink,
  createGitignore,
  createKytConfig,
  installUserDependencies,
  copyStarterKytFiles,
} from '../utils';

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
const userKytConfigPath = `${userRootPath}/'kyt.config.js'`;

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

  describe('createSrcDirectory', () => {
    test('from tmp', () => {
      shell.test.mockImplementationOnce(() => true);

      createSrcDirectory(
        { srcPath: `${userRootPath}/src`, userRootPath },
        `${userRootPath}/.kyt-tmp`
      );

      expect(logger.info).toHaveBeenCalled();
      expect(logger.task).toHaveBeenCalled();
    });

    test('from tmp and backup', () => {
      shell.test.mockImplementationOnce(() => false);

      createSrcDirectory(
        { srcPath: `${userRootPath}/src`, userRootPath },
        `${userRootPath}/.kyt-tmp`
      );

      expect(logger.info).not.toHaveBeenCalled();
      expect(logger.task).toHaveBeenCalled();
    });

    test('from starter', () => {
      shell.test.mockImplementationOnce(() => false);

      createSrcDirectory(
        { srcPath: `${userRootPath}/src`, userRootPath },
        `${userRootPath}/node_modules/kyt-starter-universal/starter-src`
      );

      expect(logger.info).not.toHaveBeenCalled();
      expect(logger.task).toHaveBeenCalled();
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

  describe('createEditorconfigLink', () => {
    test('created', () => {
      createEditorconfigLink({ userRootPath });

      expect(logger.info).not.toHaveBeenCalled();
    });

    test('created + backup', () => {
      shell.test.mockImplementationOnce(() => true);

      createEditorconfigLink({ userRootPath });

      expect(logger.info).toHaveBeenCalled();
    });
  });

  describe('createGitignore', () => {
    test('created', () => {
      shell.test.mockImplementationOnce(() => false);

      createGitignore({ userRootPath });

      expect(logger.task).toHaveBeenCalled();
    });

    test('not created', () => {
      shell.test.mockImplementationOnce(() => true);

      createGitignore({ userRootPath });

      expect(logger.task).not.toHaveBeenCalled();
    });
  });

  describe('createKytConfig', () => {
    test('created', () => {
      shell.test.mockImplementation(() => false);

      createKytConfig({ userRootPath, userKytConfigPath }, tmpDir);

      expect(logger.info).not.toHaveBeenCalled();
    });

    test('created + backup', () => {
      shell.test.mockImplementation(() => true);

      createKytConfig({ userRootPath, userKytConfigPath }, tmpDir);

      expect(logger.info).toHaveBeenCalled();
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
