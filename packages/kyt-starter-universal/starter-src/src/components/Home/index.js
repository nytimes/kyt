import React from 'react';
import * as styles from './styled';

function Home() {
  return (
    <section>
      <p className={styles.paragraphClass}>
        Welcome to the <strong>Universal React Starter-kyt</strong>. This starter kyt should serve
        as the base for an advanced, server-rendered React app.
      </p>
      <p className={styles.paragraphClass}>
        Check out the Tools section for an outline of the libraries that are used in this
        Starter-kyt.
      </p>
    </section>
  );
}

export default Home;
