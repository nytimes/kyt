const psTree = require('ps-tree');

module.exports = (pid, signal = 'SIGKILL', callback) => {
  psTree(pid, (err, children) => {
    if (err) {
      console.error('Error fetching process tree:', err);
      if (callback) callback(err);
      return;
    }
    const pidsToKill = new Set([pid, ...children.map(p => p.PID)]);
    pidsToKill.forEach(tpid => {
      try {
        process.kill(tpid, signal);
      } catch (ex) {
        console.log('Could not kill process', tpid, ex);
      }
    });
    if (callback) callback();
  });
};
