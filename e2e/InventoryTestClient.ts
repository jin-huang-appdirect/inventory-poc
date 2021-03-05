import { TestClient } from './TestClient';
import { gql } from '@apollo/client/core';
import { UserError } from '../src/errors';
import { Item } from '../src/service/Item';
import { itemFragment } from './graphqlFragment/itemFragment';

export interface ItemCreatePayload {
  item: Item;
  userErrors: UserError[];
}

export interface ItemRetrievePayload {
  serialNumbers: Object[];
  userErrors: UserError[];
}

export class InventoryTestClient extends TestClient {
  create(serialNumber: string): Promise<ItemCreatePayload> {
    return super.mutate({
      mutation: gql`
        ${itemFragment}
        mutation($serialNumber: String!) {
          itemCreate(serialNumber: $serialNumber) {
            item { ...item }
            userErrors {
              ... on DuplicateSerialNumberError {
                message
              }
            }
          }
        }
      `,
      variables: { serialNumber },
    }).then(result => result.data.itemCreate);
  }

  retrieve(quantity: number): Promise<ItemRetrievePayload> {
    return super.mutate({
      mutation: gql`
        mutation($quantity: Int!) {
          itemRetrieve(quantity: $quantity) {
            serialNumbers
            userErrors {
              ... on RetrieveQuantityError {
                message
              }
              ... on LowStockError {
                message
              }
            }
          }
        }
      `,
      variables: { quantity },
    }).then(result => result.data.itemRetrieve);
  }

  queryQuantity(): Promise<number> {
    return super.query({
      query: gql`
        query {
          itemQuantity
        }
      `,
    }).then(result => result.data.itemQuantity);
  }
}
