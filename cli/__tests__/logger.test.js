const logger = require('../logger');

describe('logger', () => {
  beforeEach(() => {
    global.console.log = jest.fn();
    global.console.dir = jest.fn();
  });

  const oneArgMethods = [
    { method: 'log', expectedPrefix: '' },
    { method: 'task', expectedPrefix: '👍  ' },
    { method: 'start', expectedPrefix: '\n🔥  ' },
    { method: 'end', expectedPrefix: '\n✅  ' },
    { method: 'info', expectedPrefix: 'ℹ️  ' },
  ];

  const twoArgMethods = [
    { method: 'warn', expectedPrefix: '🙀  ' },
    { method: 'error', expectedPrefix: '\n❌  ' },
    { method: 'debug', expectedPrefix: '🐞  ' },
  ];

  const newlineMethods = ['start', 'end', 'error'];

  [...oneArgMethods, ...twoArgMethods].forEach(({ method, expectedPrefix }) => {
    it(`logger.${method}: simple usage`, () => {
      logger[method]('here is some text');
      if (newlineMethods.indexOf(method) > -1) {
        expect(global.console.log.mock.calls).toEqual([[`${expectedPrefix}here is some text`],[]]);
      } else {
        expect(global.console.log.mock.calls).toEqual([[`${expectedPrefix}here is some text`]]);
      }
      expect(global.console.dir.mock.calls.length).toBe(0);
    });
  });

  oneArgMethods.forEach(({ method, expectedPrefix }) => {
    it(`logger.${method}: can only take one arg`, () => {
      logger[method]('here is some text', { description: 'and a second argument' });
      expect(global.console.dir.mock.calls.length).toBe(0);
      if (newlineMethods.indexOf(method) > -1) {
        expect(global.console.log.mock.calls).toEqual([[`${expectedPrefix}here is some text`],[]]);
      } else {
        expect(global.console.log.mock.calls).toEqual([[`${expectedPrefix}here is some text`]]);
      }
    });
  });

  twoArgMethods.forEach(({ method, expectedPrefix }) => {
    it(`logger.${method}: string as second argument`, () => {
      logger[method]('here is some text', 'and a second string argument');
      expect(global.console.dir.mock.calls.length).toBe(0);
      if (newlineMethods.indexOf(method) > -1) {
        expect(global.console.log.mock.calls).toEqual(
          [[`${expectedPrefix}here is some text\nand a second string argument`],[]]
        );
      } else {
        expect(global.console.log.mock.calls).toEqual(
          [[`${expectedPrefix}here is some text\nand a second string argument`]]
        );
      }
    });
  });

  twoArgMethods.forEach(({ method, expectedPrefix }) => {
    it(`logger.${method}: object as second argument`, () => {
      const objectToLog = { description: 'and some object' };
      logger[method]('here is some text', objectToLog);
      if (newlineMethods.indexOf(method) > -1) {
        expect(global.console.log.mock.calls).toEqual([[`${expectedPrefix}here is some text`],[]]);
      } else {
        expect(global.console.log.mock.calls).toEqual([[`${expectedPrefix}here is some text`]]);
      }
      expect(global.console.dir.mock.calls.length).toBe(1);
      expect(global.console.dir.mock.calls[0].length).toBe(2);
      expect(global.console.dir.mock.calls[0][0]).toBe(objectToLog);
      expect(global.console.dir.mock.calls[0][1]).toEqual({ depth: 15 });
    });
  });
});
