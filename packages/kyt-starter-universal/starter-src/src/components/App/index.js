import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.scss';
import Routes from '../../routes/';

export default function App() {
  return (
    <div>
      <i className={styles.logo} />
      <ul className={styles.nav}>
        <li className={styles.navItem}>
          <Link className={styles.link} to="/">
            Home
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.link} to="/tools">
            Tools
          </Link>
        </li>
      </ul>
      <div className={styles.content}>{Routes}</div>
    </div>
  );
}
