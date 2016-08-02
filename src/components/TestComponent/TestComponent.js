import React from 'react';
/*
 * A demo component
 * This component is built with:
 * React: https://facebook.github.io/react/
 *
*/

class TestComponent extends React.Component {
  render() {
    return ( <h2>
      This is a test component
      {this.props.hello}
      </h2>);
    }
  }

export default TestComponent;
