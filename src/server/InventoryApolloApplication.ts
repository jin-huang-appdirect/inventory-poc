import { InventoryApolloServer } from './InventoryApolloServer';

export abstract class InventoryApolloApplication {
  protected constructor(server: InventoryApolloServer, port: number) {}
  abstract async start(): Promise<void>;
  abstract async stop(): Promise<void>;
}
