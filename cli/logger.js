
const logger = console;
const write = (status, text, object) => {
  let textToLog = "";
  const task = "👍 ";
  const processStart = "🔥 ";
  const processEnd = "✅ ";
  const error = "❌ ";
  const debug = "ℹ️ ";

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
    case "error":
      textToLog = error;
      break;
    case "debug":
      textToLog = debug;
      break;
  }

  textToLog = textToLog + text;

  if(object){
    textToLog = textToLog + JSON.stringify(object, null, '  ');
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

const debug = (text, object) => {

  if(process.env.debug === 'true') {
    write('debug', text, object);
  }

};

const error = (text, err) => {
  write('error', text, err);
};

module.exports = {
  log,
  task,
  debug,
  error,
  start,
  end
};
