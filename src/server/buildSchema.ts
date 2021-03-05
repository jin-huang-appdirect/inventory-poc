import { buildFederatedSchema } from '@apollo/federation';
import { gql } from 'apollo-server';
import { readFileSync } from 'fs';
import * as path from 'path';
import { itemCreate } from '../resolvers/mutations/itemCreate';

const schemaFilePath = 'resources/schema.graphql';

export function buildSchema() {
  return buildFederatedSchema({
    typeDefs: [gql(readFileSync(path.join(__dirname, '..', schemaFilePath), 'utf8'))],
    resolvers: {
      Query: {
      },
      Mutation: {
        itemCreate
      },
    }
  });
}
