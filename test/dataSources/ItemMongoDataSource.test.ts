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

    itemMongoDataSource = new ItemMongoDataSource(collection);
  });

  beforeEach(async () => await collection.deleteMany({}));

  afterAll(async () => await connection.close());

  it('can query item quantity from mongodb', async () => {
    await collection.insertMany([{ id: v4(), serialNumber: 'serial-number-1' }]);
    expect(await itemMongoDataSource.getItemQuantity()).toEqual(1);
  });

  it('can insert item into mongodb', async () => {
    const id = v4();
    await itemMongoDataSource.insertItem({ id, serialNumber: 'serial-number-2' });
    expect(await collection.find({ id }).count()).toEqual(1);
  });

  it('can delete 2 item from mongodb', async () => {
    let id = v4();
    await collection.insertMany([{ id: v4(), serialNumber: 'serial-number-3' }]);
    await itemMongoDataSource.deleteItemById(id);
    expect(await collection.find({ id }).count()).toEqual(0);
  });
});
