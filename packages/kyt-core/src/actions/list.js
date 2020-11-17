import React from 'react';
import { render, Text } from 'ink';
import Table from 'ink-table';
import starterKyts from '../config/starterKyts';

/* eslint-disable jsx-a11y/accessible-emoji */

const List = () => {
  const data = Object.keys(starterKyts.supported).map(starterName => {
    const starter = starterKyts.supported[starterName];
    return {
      name: starter.displayName,
      description: starter.description,
      install: `select "${starter.slug}" during kyt setup`,
    };
  });

  return <Table data={data} header={({ children }) => <Text color="magenta">{children}</Text>} />;
};

module.exports = () => {
  render(<List />);
};
