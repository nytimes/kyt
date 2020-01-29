import React from 'react';
import { paragraphClass } from './styles';

function Home() {
  return (
    <section>
      <p className={paragraphClass}>
        Welcome to the <strong>Static React Starter-kyt</strong>. This starter kyt should serve as
        the base for a client rendered React app.
      </p>
      <p className={paragraphClass}>
        Check out the Tools section for an outline of the libraries that are used in this
        Starter-kyt.
      </p>
    </section>
  );
}

export default Home;
