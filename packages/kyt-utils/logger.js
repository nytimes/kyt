const logger = console;
const write = (status, text, verbose) => {
  let textToLog = '';
  let logObject = false;

  if (status === 'task') textToLog = '👍  ';
  else if (status === 'start') textToLog = '\n🔥  ';
  else if (status === 'end') textToLog = '\n✅  ';
  else if (status === 'info') textToLog = 'ℹ️  ';
  else if (status === 'warn') textToLog = '🙀  ';
  else if (status === 'error') textToLog = '\n❌  ';
  else if (status === 'debug') textToLog = '🐞  ';

  textToLog += text;

  // Adds optional verbose output
  if (verbose) {
    if (typeof verbose === 'object') {
      logObject = true;
    } else {
      textToLog += `\n${verbose}`;
    }
  }

  logger.log(textToLog);
  if (['start', 'end', 'error'].indexOf(status) > -1) {
    logger.log();
  }
  if (logObject) logger.dir(verbose, { depth: 15 });
};
// Printing any statements
const log = text => {
  logger.log(text);
};

// Starting a process
const start = text => {
  write('start', text);
};

// Ending a process
const end = text => {
  write('end', text);
};

// Tasks within a process
const task = text => {
  write('task', text);
};

// Info about a process task
const info = text => {
  write('info', text);
};

// Verbose output
// takes optional data
const debug = (text, data) => {
  write('debug', text, data);
};

// Warn output
const warn = (text, data) => {
  write('warn', text, data);
};

// Error output
// takes an optional error
const error = (text, err) => {
  write('error', text, err);
};

module.exports = {
  log,
  task,
  info,
  debug,
  warn,
  error,
  start,
  end,
};
