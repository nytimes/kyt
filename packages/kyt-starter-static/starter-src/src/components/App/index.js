import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import dynamic from 'kyt-runtime/dynamic';
import styles from './styles.scss';

const Home = dynamic(() => import(/* webpackChunkName: "home" */ '../Home'));
const Tools = dynamic(() => import(/* webpackChunkName: "tools" */ '../Tools'));

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
