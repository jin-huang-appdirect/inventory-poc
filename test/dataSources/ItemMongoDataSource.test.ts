import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';
import { Collection, MongoClient } from 'mongodb';
import { v4 } from 'uuid';

describe('item mongo data source', () => {
  let connection: MongoClient, collection: Collection;

  beforeAll(async () => {
    const configuration = new InventoryServerConfiguration('test-db', 9000);
    const client = new MongoClient(configuration.mongoUrl.toString(),  { useUnifiedTopology: true });
    connection = await client.connect();
    collection = connection.db('test-db').collection<any>('item-test');
    await collection.deleteMany({});
    await collection.insertMany([{ id: v4(), serialNumber: 'serial-number-1' }]);
  });

  afterAll(async () => await connection.close());

  it('can query item quantity from mongodb', () => {

  });
});
