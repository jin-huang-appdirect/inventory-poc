import { ApolloServer } from 'apollo-server';

export abstract class InventoryApolloServer extends ApolloServer {

  abstract async openConnections(): Promise<void>;

  abstract async closeConnections(): Promise<void>;
}
