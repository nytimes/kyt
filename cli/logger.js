const kytConfig = require('../config/kyt.config.js');
const logger = console;
const write = (status, text, verbose) => {
  let textToLog = "";
  const task = "👍 ";
  const processStart = "🔥 ";
  const processEnd = "✅ ";
  const error = "❌ ";
  const debug = "🐞 ";
  const info = "ℹ️ ";

  switch(status) {
    case "task":
      textToLog = task;
      break;
    case "start":
      textToLog = processStart;
      break;
    case "end":
      textToLog = processEnd;
      break;
    case "info":
      textToLog = info;
      break;
    case "error":
      textToLog = error;
      break;
    case "debug":
      textToLog = debug;
      break;
  }

  textToLog = textToLog + text;

  if (verbose) {
    if (typeof(verbose) === 'object') {
      textToLog = textToLog + '\n' + JSON.stringify(verbose, null, '  ');
    } else {
      textToLog = textToLog + '\n' + verbose;
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

  if(kytConfig.debug) {
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
  end
};
