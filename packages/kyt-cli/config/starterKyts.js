module.exports = {
  supported: {
    universal: {
      displayName: 'Universal',
      path: '/packages/kyt-starter-universal/',
      description: 'This starter-kyt should serve as the base for an advanced, server and client-rendered (isomorphic) React app.',
      install: 'Select universal in kyt-cli setup',
    },
    static: {
      displayName: 'Static',
      path: '/packages/kyt-starter-static/',
      description: 'This starter-kyt should serve as the base for an advanced client-rendered React app.',
      install: 'Select static in kyt-cli setup',
    },
  },
  recommended: {
    redux: {
      displayName: 'Redux',
      description: 'This starter-kyt should serve as the base for an advanced, isomorphic React app that will use Redux.',
      install: 'kyt-cli setup -r https://github.com/julianvmodesto/kyt-starter-universal-redux.git',
    },
  },
};
