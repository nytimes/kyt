import { test } from 'ava';
import sinon from 'sinon';
import logger from '../../cli/logger';

test.beforeEach(() => {
  sinon.stub(console);
});

test.afterEach(() => {
  sinon.restore(console);
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
  test(`logger.${method}: simple usage`, (t) => {
    logger[method]('here is some text');
    // these aren't invocations of console methods, but eslint thinks they are
    /* eslint-disable no-console */
    t.is(console.log.callCount, 1, 'calls console.log once');
    t.is(console.log.args[0].length, 1, 'passes one argument');
    t.is(console.log.args[0][0], `${expectedPrefix}here is some text`, 'adds the correct prefix');
    /* eslint-enable no-console */
  });
});

simpleMethods.forEach(({ method, expectedPrefix }) => {
  test(`logger.${method}: can only take one arg`, (t) => {
    logger[method]('here is some text', { description: 'and a second argument' });
    /* eslint-disable no-console */
    t.is(console.log.callCount, 1, 'calls console.log once');
    t.is(console.dir.callCount, 0, 'never calls console.dir');
    t.deepEqual(console.log.args[0], [`${expectedPrefix}here is some text`],
      'only passes the first argument to console.log');
    /* eslint-enable no-console */
  });
});

advancedMethods.forEach(({ method, expectedPrefix }) => {
  test(`logger.${method}: string as second argument`, (t) => {
    logger[method]('here is some text', 'and a second string argument');
    /* eslint-disable no-console */
    t.is(console.log.callCount, 1, 'calls console.log once');
    t.is(console.dir.callCount, 0, 'never calls console.dir');
    t.deepEqual(console.log.args[0], [`${expectedPrefix}here is some text\nand a second string argument`],
      'if the second argument is a string, it concatenates it and a newline to the first arg');
    /* eslint-enable no-console */
  });
});

advancedMethods.forEach(({ method, expectedPrefix }) => {
  test(`logger.${method}: object as second argument`, (t) => {
    const objectToLog = { description: 'and some object' };
    logger[method]('here is some text', objectToLog);
    /* eslint-disable no-console */
    t.is(console.log.callCount, 1, 'calls console.log once');
    t.is(console.dir.callCount, 1, 'also calls console.dir');
    t.deepEqual(console.log.args[0], [`${expectedPrefix}here is some text`],
      'console.log gets the first argument');
    t.is(console.dir.args[0].length, 2);
    t.is(console.dir.args[0][0], objectToLog,
      'if the second argument is an object, pass it as the first arg to console.dir');
    t.deepEqual(console.dir.args[0][1], { depth: 15 },
      'should pass correct settings object as second arg to console.dir');
    /* eslint-enable no-console */
  });
});
