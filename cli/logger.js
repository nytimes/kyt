
const kytConfig = require('../config/kyt.config');

const logger = console;
const write = (status, text, verbose) => {
  let textToLog = '';

  if (status === 'task') textToLog = '👍  ';
  else if (status === 'start') textToLog = '🔥  ';
  else if (status === 'end') textToLog = '✅  ';
  else if (status === 'info') textToLog = 'ℹ️  ';
  else if (status === 'error') textToLog = '❌  ';
  else if (status === 'debug') textToLog = '🐞  ';

  textToLog += text;

  if (verbose) {
    if (typeof verbose === 'object') {
      textToLog += `\n${JSON.stringify(verbose, null, '  ')}`;
    } else {
      textToLog += `\n${verbose}`;
    }
  }

  logger.log(textToLog);
};

const log = (text) => {
  logger.log(text);
};

const start = (text) => {
  write('start', text);
};

const end = (text) => {
  write('end', text);
};

const task = (text) => {
  write('task', text);
};

const info = (text) => {
  write('info', text);
};

const debug = (text, object) => {
  if (kytConfig.debug) {
    write('debug', text, object);
  }
};

const error = (text, err) => {
  write('error', text, err);
};

module.exports = {
  log,
  task,
  info,
  debug,
  error,
  start,
  end,
};
