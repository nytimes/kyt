var psTree = require('ps-tree');

// Loops through processes and kills them
module.exports = function (pid, signal, callback) {
    signal   = signal || 'SIGKILL';
    callback = callback || function () {};
    psTree(pid, function (err, children) {
      let arr = [pid].concat(
        children.map(function (p) {
          return p.PID;
        })
      );
      arr = arr.filter((item, poss) => {
        return arr.indexOf(item) == poss;
      });
      arr.forEach(function (tpid) {
          try { process.kill(tpid, signal) }
          catch (ex) {
            console.log('Could not kill process', tpid, ex);
          }
        });
        callback();
    });
};
