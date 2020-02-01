import React from 'react';
import * as styles from './styles';

function Tools() {
  return (
    <ul>
      <li className={styles.toolClass}>
        <a href="https://expressjs.com/">Express</a> - server-side rendering
      </li>
      <li className={styles.toolClass}>
        <a href="https://facebook.github.io/react/">React</a> - component library
      </li>
      <li className={styles.toolClass}>
        <a href="https://github.com/reactjs/react-router">React Router</a> - server and browser
        routing
      </li>
      <li className={styles.toolClass}>
        <a href="https://github.com/nytimes/pretty-lights">Pretty Lights</a> - CSS-in-JS with a
        reliable API
      </li>
      <li className={styles.toolClass}>
        <a href="https://github.com/airbnb/enzyme">Enzyme</a> - React component testing
      </li>
    </ul>
  );
}

export default Tools;
