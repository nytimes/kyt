import { css } from 'pretty-lights';
import { padding } from '../../shared-styles/variables';

// eslint-disable-next-line import/prefer-default-export
export const paragraphClass = css`
  & + & {
    padding-top: ${padding}px;
  }
`;
