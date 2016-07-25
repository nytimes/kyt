import React from 'react';

/*
 * A demo component to show how testing works
 *
*/
class TestComponent extends React.Component {
  render() {
    var classes = this.props.sheet.classes;
    return ( <h2>This is a test component</h2>);
  }

}

export default TestComponent;
