import { InventoryApolloServer } from './InventoryApolloServer';
import { InventoryServerConfiguration } from './InventoryServerConfiguration';
import { buildSchema } from './buildSchema';

export class InventoryServer extends InventoryApolloServer {

  constructor(configuration: InventoryServerConfiguration) {
    super({
      schema: buildSchema(),
    });
  }

  async openConnections(): Promise<void> {
    return;
  }

  async closeConnections(): Promise<void> {
    return;
  }
}
