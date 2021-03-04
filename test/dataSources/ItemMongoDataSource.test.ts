import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';
import { Collection, MongoClient } from 'mongodb';
import { v4 } from 'uuid';
import { ItemMongoDataSource } from '../../src/dataSources/ItemMongoDataSource';

describe('item mongo data source', () => {
  let connection: MongoClient, collection: Collection, itemMongoDataSource: ItemMongoDataSource;

  beforeAll(async () => {
    const configuration = new InventoryServerConfiguration('test-db', 9000);
    const client = new MongoClient(configuration.mongoUrl.toString(),  { useUnifiedTopology: true });
    connection = await client.connect();
    collection = connection.db('test-db').collection<any>('item-test');
    await collection.deleteMany({});
    await collection.insertMany([{ id: v4(), serialNumber: 'serial-number-1' }]);

    itemMongoDataSource = new ItemMongoDataSource(collection);
  });

  afterAll(async () => await connection.close());

  it('can query item quantity from mongodb', async () => {
    expect(await itemMongoDataSource.getItemQuantity()).toEqual(1);
  });
});
