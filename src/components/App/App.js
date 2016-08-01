
import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

function App({ children }) {
  return (
    <div>
      <h1>React Kyt!</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      {children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
};

export default App;
