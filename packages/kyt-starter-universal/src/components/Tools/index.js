
import React from 'react';
import styles from './styles.scss';

function Tools() {
  return (
    <ul>
      <li className={styles.tool}>
        <a href="https://expressjs.com/">Express</a> - server-side rendering
      </li>
      <li className={styles.tool}>
        <a href="https://facebook.github.io/react/">React</a> - component library
      </li>
      <li className={styles.tool}>
        <a href="https://github.com/reactjs/react-router">React Router</a> - server and browser routing
      </li>
      <li className={styles.tool}>
        <a href="https://github.com/css-modules/css-modules">Sass Modules</a> - CSS Modules with a Sass pre-processor for styles
      </li>
      <li className={styles.tool}>
        <a href="https://github.com/airbnb/enzyme">Enzyme</a> - React component testing
      </li>
    </ul>
  );
}

export default Tools;
