const logger = require('../logger');

describe('logger', () => {
  beforeEach(() => {
    global.console.log = jest.fn();
    global.console.dir = jest.fn();
  });

  const simpleMethods = [
    { method: 'log', expectedPrefix: '' },
    { method: 'task', expectedPrefix: '👍  ' },
    { method: 'start', expectedPrefix: '🔥  ' },
    { method: 'end', expectedPrefix: '✅  ' },
    { method: 'info', expectedPrefix: 'ℹ️  ' },
  ];

  const advancedMethods = [
    { method: 'warn', expectedPrefix: '🙀  ' },
    { method: 'error', expectedPrefix: '❌  ' },
    { method: 'debug', expectedPrefix: '🐞  ' },
  ];

  [...simpleMethods, ...advancedMethods].forEach(({ method, expectedPrefix }) => {
    it(`logger.${method}: simple usage`, () => {
      logger[method]('here is some text');
      expect(global.console.log.mock.calls).toEqual([[`${expectedPrefix}here is some text`]]);
      expect(global.console.dir.mock.calls.length).toBe(0);
    });
  });

  simpleMethods.forEach(({ method, expectedPrefix }) => {
    it(`logger.${method}: can only take one arg`, () => {
      logger[method]('here is some text', { description: 'and a second argument' });
      expect(global.console.dir.mock.calls.length).toBe(0);
      expect(global.console.log.mock.calls).toEqual([[`${expectedPrefix}here is some text`]]);
    });
  });

  advancedMethods.forEach(({ method, expectedPrefix }) => {
    it(`logger.${method}: string as second argument`, () => {
      logger[method]('here is some text', 'and a second string argument');
      expect(global.console.dir.mock.calls.length).toBe(0);
      expect(global.console.log.mock.calls).toEqual(
        [[`${expectedPrefix}here is some text\nand a second string argument`]]
      );
    });
  });

  advancedMethods.forEach(({ method, expectedPrefix }) => {
    it(`logger.${method}: object as second argument`, () => {
      const objectToLog = { description: 'and some object' };
      logger[method]('here is some text', objectToLog);
      expect(global.console.log.mock.calls).toEqual([[`${expectedPrefix}here is some text`]]);
      expect(global.console.dir.mock.calls.length).toBe(1);
      expect(global.console.dir.mock.calls[0].length).toBe(2);
      expect(global.console.dir.mock.calls[0][0]).toBe(objectToLog);
      expect(global.console.dir.mock.calls[0][1]).toEqual({ depth: 15 });
    });
  });
});
