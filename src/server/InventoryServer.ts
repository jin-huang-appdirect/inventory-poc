import { InventoryApolloServer } from './InventoryApolloServer';
import { InventoryServerConfiguration } from './InventoryServerConfiguration';
import { buildSchema } from './buildSchema';
import { Db, MongoClient } from 'mongodb';

export class InventoryServer extends InventoryApolloServer {
  connection: MongoClient;
  db: Db;
  configuration: InventoryServerConfiguration;

  constructor(configuration: InventoryServerConfiguration) {
    super({
      schema: buildSchema(),
    });
    this.configuration = configuration;
  }

  async openConnections(): Promise<void> {
    const client = new MongoClient(this.configuration.mongoUrl.toString(),  { useUnifiedTopology: true });
    this.connection =  await client.connect();
    this.db = this.connection.db(this.configuration.dbName);
  }

  async closeConnections(): Promise<void> {
    await this.connection.close();
  }
}
