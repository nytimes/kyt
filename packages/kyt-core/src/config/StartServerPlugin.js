const cluster = require('cluster');

/* eslint-disable class-methods-use-this,no-underscore-dangle */

class StartServerPlugin {
  constructor(options) {
    if (options == null) {
      options = {};
    }
    if (typeof options === 'string') {
      options = { name: options };
    }
    this.options = {
      signal: false,
      // Only listen on keyboard in development, so the server doesn't hang forever
      keyboard: process.env.NODE_ENV === 'development',
      ...options,
    };
    this.afterEmit = this.afterEmit.bind(this);
    this.apply = this.apply.bind(this);
    this.startServer = this.startServer.bind(this);

    this.worker = null;
    if (this.options.restartable !== false) {
      this._enableRestarting();
    }
  }

  _enableRestarting() {
    if (this.options.keyboard) {
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', data => {
        if (data.trim() === 'rs') {
          console.log('Restarting app...');
          process.kill(this.worker.process.pid);
          cluster.fork();
        }
      });
    }
  }

  _getExecArgv() {
    const { options } = this;
    const execArgv = (options.nodeArgs || []).concat(process.execArgv);
    // eslint-disable-next-line kyt/no-immediate-return
    return execArgv;
  }

  _getArgs() {
    const { options } = this;
    const argv = options.args || [];
    // eslint-disable-next-line kyt/no-immediate-return
    return argv;
  }

  _getInspectPort(execArgv) {
    const inspectArg = execArgv.find(arg => arg.includes('--inspect'));
    if (!inspectArg || !inspectArg.includes('=')) {
      return null;
    }
    const hostPort = inspectArg.split('=')[1];
    const port = hostPort.includes(':') ? hostPort.split(':')[1] : hostPort;
    return parseInt(port, 10);
  }

  _getSignal() {
    const { signal } = this.options;
    // allow users to disable sending a signal by setting to `false`...
    if (signal === false) return null;
    if (signal === true) return 'SIGUSR2';
    return signal;
  }

  afterEmit(compilation, callback) {
    if (this.worker && this.worker.isConnected()) {
      const signal = this._getSignal();
      process.kill(this.worker.process.pid, signal);
      cluster.fork();
      return;
    }
    this.startServer(compilation, callback);
  }

  apply(compiler) {
    // Use the Webpack 4 Hooks API when possible.
    if (compiler.hooks) {
      const plugin = { name: 'StartServerPlugin' };

      compiler.hooks.afterEmit.tapAsync(plugin, this.afterEmit);
    } else {
      compiler.plugin('after-emit', this.afterEmit);
    }
  }

  startServer(compilation, callback) {
    const { options } = this;
    let name;
    const names = Object.keys(compilation.assets);
    if (options.name) {
      name = options.name;
      if (!compilation.assets[name]) {
        console.error(`Entry ${name} not found. Try one of: ${names.join(' ')}`);
      }
    } else {
      [name] = names;
      if (names.length > 1) {
        console.log(`More than one entry built, selected ${name}. All names: ${names.join(' ')}`);
      }
    }
    const { existsAt } = compilation.assets[name];
    this._entryPoint = existsAt;

    this._startServer(worker => {
      this.worker = worker;
      callback();
    });
  }

  _startServer(callback) {
    const args = this._getArgs();
    const execArgv = this._getExecArgv();
    const inspectPort = this._getInspectPort(execArgv);

    const clusterOptions = {
      exec: this._entryPoint,
      execArgv,
      args,
    };

    if (inspectPort) {
      clusterOptions.inspectPort = inspectPort;
    }
    cluster.setupMaster(clusterOptions);

    cluster.on('online', worker => {
      callback(worker);
    });

    cluster.fork();
  }
}

module.exports = StartServerPlugin;
