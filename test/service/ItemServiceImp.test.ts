import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';
import { Collection, MongoClient } from 'mongodb';
import { v4 } from 'uuid';
import { ItemMongoDataSource } from '../../src/dataSources/ItemMongoDataSource';
import { InventoryServiceImp } from '../../src/service/InventoryServiceImp';
import { InventoryService } from '../../src/service/InventoryService';

describe('item mongo service', () => {
  let connection: MongoClient, collection: Collection;
  let itemMongoDataSource: ItemMongoDataSource, inventoryService: InventoryService;

  beforeAll(async () => {
    const configuration = new InventoryServerConfiguration('test-db', 9000);
    const client = new MongoClient(configuration.mongoUrl.toString(),  { useUnifiedTopology: true });
    connection = await client.connect();
    collection = connection.db('test-db').collection<any>('service-test');

    itemMongoDataSource = new ItemMongoDataSource(collection);
    inventoryService = new InventoryServiceImp(itemMongoDataSource);
  });

  beforeEach(async () => await collection.deleteMany({}));

  afterAll(async () => await connection.close());

  it('can query item quantity', async () => {
    await collection.insertMany([{ id: v4(), serialNumber: 'serial-number-1' }]);

    expect(await inventoryService.getItemQuantity()).toEqual(1);
  });
});
