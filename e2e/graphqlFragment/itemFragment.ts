import { gql } from '@apollo/client/core';

export const itemFragment = gql`  
  fragment item on Item {
    serialNumber
  }
`;
