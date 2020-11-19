const React = require('react');
const PropTypes = require('prop-types');

export const LoadableContext = React.createContext({});

export function Capture(props) {
  return React.createElement(
    LoadableContext.Provider,
    { value: { report: props.report } },
    props.children
  );
}

Capture.propTypes = {
  report: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
