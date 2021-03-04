import { InventoryServer } from './InventoryServer';

export abstract class InventoryApolloApplication {
  protected constructor(server: InventoryServer, port: number) {}
  abstract async start(): Promise<void>;
  abstract async stop(): Promise<void>;
}
