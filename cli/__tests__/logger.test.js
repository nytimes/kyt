const logger = require('../logger');

describe('logger', () => {
  it('exposes console-like interface', () => {
    const expectedFns = [
      'log',
      'task',
      'info',
      'debug',
      'warn',
      'error',
      'start',
      'end',
    ];

    expectedFns.forEach(fn => {
      expect(typeof logger[fn]).toBe('function');
    });
  });
});
