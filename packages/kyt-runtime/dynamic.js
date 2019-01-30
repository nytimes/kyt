const Loadable = require('react-loadable');

const Loading = () => null;

function dynamic(loader, opts = {}) {
  return Loadable({
    loader,
    loading: Loading,
    ...opts,
  });
}

module.exports = dynamic;
