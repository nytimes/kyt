import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';
import dynamic from 'kyt-runtime/dynamic';
import styles from './styles.scss';

export const Home = dynamic(() => import(/* webpackChunkName: "home" */ '../Home'));
export const Tools = dynamic(() => import(/* webpackChunkName: "tools" */ '../Tools'));

function App() {
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
      <div className={styles.content}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/tools" component={Tools} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
