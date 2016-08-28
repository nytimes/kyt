
const kytConfigFn = require('./kytConfig');
module.exports = (callback, program, optionalConfig) => {
	kytConfigFn(optionalConfig);
	callback(program);
};
