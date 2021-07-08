import React from 'react';
import * as styles from './styled';

function Tools() {
  return (
    <ul>
      <li className={styles.toolClass}>
        <a href="https://expressjs.com/">Express</a> - server-side rendering
      </li>
      <li className={styles.toolClass}>
        <a href="https://reactjs.org/">React</a> - component library
      </li>
      <li className={styles.toolClass}>
        <a href="https://reacttraining.com/react-router/">React Router</a> - server and browser
        routing
      </li>
      <li className={styles.toolClass}>
        <a href="https://github.com/nytimes/pretty-lights">Pretty Lights</a> - CSS-in-JS with a
        reliable API
      </li>
      <li className={styles.toolClass}>
        <a href="https://testing-library.com/docs/react-testing-library/intro/">
          React Testing Library
        </a>{' '}
        - React component testing
      </li>
    </ul>
  );
}

export default Tools;
