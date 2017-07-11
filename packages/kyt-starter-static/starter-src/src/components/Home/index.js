import React from 'react';
import styles from './styles.scss';

function Home() {
  return (
    <section>
      <p className={styles.paragraph}>
        Welcome to the <strong>Static React Starter-kyt</strong>. This starter kyt should serve as
        the base for a client rendered React app.
      </p>
      <p className={styles.paragraph}>
        Check out the Tools section for an outline of the libraries that are used in this
        Starter-kyt.
      </p>
    </section>
  );
}

export default Home;
