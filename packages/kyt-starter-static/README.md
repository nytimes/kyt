# Static React starter-kyt

This starter-kyt should serve as the base for an advanced client-rendered React app.

## Installation

1. Create a new directory and install [kyt](https://github.com/NYTimes/kyt)
2. `node_modules/.bin/kyt setup -r git@github.com:nytimes/kyt-starter-static.git`

## Tools

The following are some of the tools included in this starter-kyt:

- [React](https://facebook.github.io/react/) - Component library
- [React Router](https://github.com/reactjs/react-router) - Server and client routing
- [Sass Modules](https://github.com/css-modules/css-modules) - CSS Modules with a Sass pre-processor for styles
- [Enzyme](https://github.com/airbnb/enzyme) - React component testing
- [html webpack plugin](https://github.com/ampedandwired/html-webpack-plugin) - Builds a static html file

## Notes on implementation

- You will find a `src/index.ejs` file which gets compiled to an html fileby the html webpack plugin. See more for configuration in the kyt.config.js. After a build, kyt will copy the html build into `build/public`.

- As a performance optimization, React Router routes are loaded dynamically and chunked separately using the ES2015 `System.import` directive. See more about  [Webpack 2 support](https://gist.github.com/sokra/27b24881210b56bbaff7#code-splitting-with-es6) and [dynamic routing](https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md).

## How To Contribute
Want to build your own starter-kyt?
See directions [here](https://github.com/NYTimes/kyt/docs/Starterkyts.md).

## Changelog
