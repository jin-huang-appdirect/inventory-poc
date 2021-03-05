import { buildFederatedSchema } from '@apollo/federation';
import { gql } from 'apollo-server';
import { readFileSync } from 'fs';
import * as path from 'path';
import { itemCreate } from '../resolvers/mutations/itemCreate';
import { itemQuantity } from '../resolvers/queries/itemQuantity';
import { itemRetrieve } from '../resolvers/mutations/itemRetrieve';

const schemaFilePath = 'resources/schema.graphql';

export function buildSchema() {
  return buildFederatedSchema({
    typeDefs: [gql(readFileSync(path.join(__dirname, '..', schemaFilePath), 'utf8'))],
    resolvers: {
      Query: {
        itemQuantity,
      },
      Mutation: {
        itemCreate,
        itemRetrieve
      },
    }
  });
}
