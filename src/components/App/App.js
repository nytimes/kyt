
import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import classes from './style';

function App({ children }) {
  return (
    <div>
      <h1 className={classes.header}>React Kyt</h1>
      <ul className={classes.links}>
        <li className={classes.link}><Link to="/">Home</Link></li>
        <li className={classes.link}><Link to="/about">About</Link></li>
      </ul>
      {children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
};

export default App;
