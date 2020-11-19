import React from 'react';
import { LoadableContext } from './Capture';

/* eslint-disable no-underscore-dangle,consistent-return */

const ALL_INITIALIZERS = [];
const READY_INITIALIZERS = [];

function isWebpackReady(getModuleIds) {
  // eslint-disable-next-line camelcase
  if (typeof __webpack_modules__ !== 'object') {
    return false;
  }

  return getModuleIds().every(function compare(moduleId) {
    // eslint-disable-next-line camelcase,no-undef
    return typeof moduleId !== 'undefined' && typeof __webpack_modules__[moduleId] !== 'undefined';
  });
}

function load(loader) {
  const promise = loader();

  const state = {
    loading: true,
    loaded: null,
    error: null,
  };

  state.promise = promise
    .then(function successFn(loaded) {
      state.loading = false;
      state.loaded = loaded;
      return loaded;
    })
    .catch(function failureFn(err) {
      state.loading = false;
      state.error = err;
      throw err;
    });

  return state;
}

function resolveModule(obj) {
  return obj && obj.__esModule ? obj.default : obj;
}

function render(loaded, props) {
  return React.createElement(resolveModule(loaded), props);
}

function createLoadableComponent(loadFn, options) {
  if (!options.loading) {
    throw new Error('react-loadable requires a `loading` component');
  }

  const opts = {
    loader: null,
    loading: null,
    delay: 200,
    timeout: null,
    render,
    webpack: null,
    modules: null,
    ...options,
  };

  let res = null;

  function init() {
    if (!res) {
      res = loadFn(opts.loader);
    }
    return res.promise;
  }

  ALL_INITIALIZERS.push(init);

  if (typeof opts.webpack === 'function') {
    READY_INITIALIZERS.push(function webpackFn() {
      if (isWebpackReady(opts.webpack)) {
        return init();
      }
    });
  }

  class LoadableComponent extends React.Component {
    constructor(props) {
      super(props);
      init();

      this.state = {
        error: res.error,
        pastDelay: false,
        timedOut: false,
        loading: res.loading,
        loaded: res.loaded,
      };
    }

    _loadModule() {
      if (this.context.report && Array.isArray(opts.modules)) {
        opts.modules.forEach(moduleName => {
          this.context.report(moduleName);
        });
      }

      if (!res.loading) {
        return;
      }

      if (typeof opts.delay === 'number') {
        if (opts.delay === 0) {
          this.setState({ pastDelay: true });
        } else {
          this._delay = setTimeout(() => {
            this.setState({ pastDelay: true });
          }, opts.delay);
        }
      }

      if (typeof opts.timeout === 'number') {
        this._timeout = setTimeout(() => {
          this.setState({ timedOut: true });
        }, opts.timeout);
      }

      const update = () => {
        if (!this._mounted) {
          return;
        }

        this.setState({
          error: res.error,
          loaded: res.loaded,
          loading: res.loading,
        });

        this._clearTimeouts();
      };

      res.promise
        .then(function successFn() {
          update();
        })
        .catch(function failureFn() {
          update();
        });
    }

    componentWillUnmount() {
      this._mounted = false;
      this._clearTimeouts();
    }

    _clearTimeouts() {
      clearTimeout(this._delay);
      clearTimeout(this._timeout);
    }

    retry() {
      this.setState({ error: null, loading: true, timedOut: false });
      res = loadFn(opts.loader);
      this._loadModule();
    }

    render() {
      if (!this._mounted) {
        this._mounted = true;
        this._loadModule();
      }
      if (this.state.loading || this.state.error) {
        return React.createElement(opts.loading, {
          isLoading: this.state.loading,
          pastDelay: this.state.pastDelay,
          timedOut: this.state.timedOut,
          error: this.state.error,
          retry: this.retry,
        });
      }
      if (this.state.loaded) {
        return opts.render(this.state.loaded, this.props);
      }
      return null;
    }
  }

  LoadableComponent.contextType = LoadableContext;

  LoadableComponent.preload = function preload() {
    return init();
  };

  return LoadableComponent;
}

function flushInitializers(initializers) {
  const promises = [];

  while (initializers.length) {
    const init = initializers.pop();
    promises.push(init());
  }

  return Promise.all(promises).then(function successFn() {
    if (initializers.length) {
      return flushInitializers(initializers);
    }
  });
}

export function preloadAll() {
  return new Promise(function promiseFn(resolve, reject) {
    flushInitializers(ALL_INITIALIZERS).then(resolve, reject);
  });
}

export function preloadReady() {
  return new Promise(function promiseFn(resolve) {
    // We always will resolve, errors should be handled within loading UIs.
    flushInitializers(READY_INITIALIZERS).then(resolve, resolve);
  });
}

export function Loadable(opts) {
  return createLoadableComponent(load, opts);
}
