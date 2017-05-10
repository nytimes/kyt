
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import styles from './styles.scss';
import Home from '../Home';
import Tools from '../Tools';

// Unfortunately, HMR breaks when we dynamically resolve
// routes so we need to require them here as a workaround.
// https://github.com/gaearon/react-hot-loader/issues/288
if (module.hot) {
    require('../Home');    // eslint-disable-line global-require
    require('../Tools');   // eslint-disable-line global-require
}

function App() {
  return (
    <div>
      <i className={styles.logo} />
      <ul className={styles.nav}>
        <li className={styles.navItem}>
          <Link className={styles.link} to="/">Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.link} to="/tools">Tools</Link>
        </li>
      </ul>
      <div className={styles.content}>
        <Switch>
            <Route exact path ="/" component={Home} />
            <Route path="tools" component={Tools} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
