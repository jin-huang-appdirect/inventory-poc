import { InventoryApolloServer } from './InventoryApolloServer';
import { InventoryServerConfiguration } from './InventoryServerConfiguration';
import { buildSchema } from './buildSchema';
import { Db, MongoClient } from 'mongodb';
import { ItemMongoDataSource } from '../dataSources/ItemMongoDataSource';
import { InventoryServiceImp } from '../service/InventoryServiceImp';

export class InventoryServer extends InventoryApolloServer {
  connection: MongoClient;
  db: Db;
  configuration: InventoryServerConfiguration;

  constructor(configuration: InventoryServerConfiguration) {
    super({
      schema: buildSchema(),
      plugins: [
        {
          requestDidStart: ({ context }) => {
            context.inventoryService = new InventoryServiceImp(new ItemMongoDataSource(this.db.collection('items')),
              new ItemMongoDataSource(this.db.collection('soldItems')));
          },
        },
      ],
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
