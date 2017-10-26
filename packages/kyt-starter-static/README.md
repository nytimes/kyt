# Static React starter-kyt

This starter-kyt should serve as the base for an advanced client-rendered React app.

## Installation

1. run `kyt-cli setup`
2. select `static` from the list of starter-kyts


## Tools

The following are some of the tools included in this starter-kyt:

- [React](https://facebook.github.io/react/) - Component library
- [React Router](https://github.com/reactjs/react-router) - Server and client routing
- [Sass Modules](https://github.com/css-modules/css-modules) - CSS Modules with a Sass pre-processor for styles
- [Enzyme](https://github.com/airbnb/enzyme) - React component testing
- [html webpack plugin](https://github.com/ampedandwired/html-webpack-plugin) - Builds a static html file

## Notes on implementation

- You will find a `src/index.ejs` file which gets compiled to an html file by the html webpack plugin. See more for configuration in the kyt.config.js. After a build, kyt will copy the html build into `build/public`.

- As a performance optimization, React Router routes are loaded dynamically and chunked separately using the ES2015 `import()` directive. See more about  [Webpack 2 support](https://gist.github.com/sokra/27b24881210b56bbaff7#code-splitting-with-es6) and [dynamic routing](https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md).

- Assets from `src/public` are accessible from `/` in both `dev` and production (`build`).

- Note, if your site uses routes, `dev` is configured with the [history api fallback](https://github.com/bripkens/connect-history-api-fallback) to support routing. In production (after a `build`), you will need to setup an edge/server, like nginx or Varnish, to forward routed requests to your `build/index.html`.

## How To Contribute
Want to build your own starter-kyt?
See directions [here](https://github.com/NYTimes/kyt/docs/Starterkyts.md).

## Changelog

0.6.0 - 10/19/17

- Upgrades `kyt-core` to 0.9.0 and `babel-preset-kyt-react` to 0.3.0.

0.5.1 - 08/08/17

- Fixes bug (regression from 0.3.0) where build would bake in the bundles/scripts in the wrong order. The errors from this bug may take different forms, but a good way to verify that this is working correctly is that after calling `kyt build` the `build/public/index.html` shows the bundled scripts in the following order: `manifest.js`, `vendor.js`, then `main.js`.
