import { InventoryServer } from './InventoryServer';
import { InventoryApolloApplication } from './InventoryApolloApplication';

export class InventoryApplication extends InventoryApolloApplication{
  constructor(server: InventoryServer, port: number) {
    super(server, port);
  }

  async start(): Promise<void> {
  }

  public async stop(): Promise<void> {
  }
}
