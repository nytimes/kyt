import { css } from 'pretty-lights';
import { padding } from '../../shared-styles/variables';

// eslint-disable-next-line
export const paragraphClass = css`
  & + & {
    padding-top: ${padding}px;
  }
`;
