# Static React starter-kyt

This starter-kyt should serve as the base for an advanced client-rendered React app.

## Installation

1. run `kyt-cli setup`
2. select `static` from the list of starter-kyts

## Tools

The following are some of the tools included in this starter-kyt:

- [React](https://reactjs.org/) - Component library
- [React Router](https://reacttraining.com/react-router/) - Server and client routing
- [Pretty Lights](https://github.com/nytimes/pretty-lights) - CSS-in-JS with a reliable API
- [Enzyme](https://airbnb.io/enzyme/) - React component testing
- [html webpack plugin](https://github.com/ampedandwired/html-webpack-plugin) - Builds a static html file

## Notes on implementation

- You will find a `src/index.ejs` file which gets compiled to an html file by the html webpack plugin. See more for configuration in the kyt.config.js. After a build, kyt will copy the html build into `build/public`.

- Assets from `src/public` are accessible from `/` in both `dev` and production (`build`).

- Note, if your site uses routes, `dev` is configured with the [history api fallback](https://github.com/bripkens/connect-history-api-fallback) to support routing. In production (after a `build`), you will need to setup an edge/server, like nginx or Varnish, to forward routed requests to your `build/index.html`.

## How To Contribute

Want to build your own starter-kyt?
See directions [here](https://github.com/NYTimes/kyt/docs/Starterkyts.md).
