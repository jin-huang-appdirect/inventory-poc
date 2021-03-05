import { InventoryApplication } from '../src/server/InventoryApplication';
import { InventoryServer } from '../src/server/InventoryServer';
import { InventoryServerConfiguration } from '../src/server/InventoryServerConfiguration';
import { InventoryTestClient } from './InventoryTestClient';

export class TestApplication {
  app: InventoryApplication;
  client: InventoryTestClient;

  constructor(configuration: InventoryServerConfiguration) {
    this.app =  new InventoryApplication(new InventoryServer(configuration), configuration.port);
    this.client = new InventoryTestClient(new URL(`http://localhost:${configuration.port}/api/graphql`));
  }

  async start(): Promise<void> {
    await this.app.start();
  }

  async stop(): Promise<void> {
    await this.app.stop();
  }

  clearDb(): Promise<void> {
    return this.app.server.db.dropDatabase();
  }
}
