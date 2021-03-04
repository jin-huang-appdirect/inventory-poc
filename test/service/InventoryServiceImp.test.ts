import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';
import { Collection, MongoClient } from 'mongodb';
import { v4 } from 'uuid';
import { ItemMongoDataSource } from '../../src/dataSources/ItemMongoDataSource';
import { InventoryServiceImp } from '../../src/service/InventoryServiceImp';
import { InventoryService } from '../../src/service/InventoryService';
import { DuplicateSerialNumberError, LowStockError } from '../../src/errors';

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

  it('can add item', async () => {
    await inventoryService.addItem({ serialNumber: 'serial-number-2' });
    expect(await collection.find().count()).toEqual(1);
  });

  it('throw error when item already exists', async () => {
    try {
      await inventoryService.addItem({ serialNumber: 'serial-number-3' });
      await inventoryService.addItem({ serialNumber: 'serial-number-3' });
    } catch (error) {
      expect(error).toBeInstanceOf(DuplicateSerialNumberError);
    }
  });

  it('can delete item by serialNumber', async () => {
    await collection.insertMany([{ id: v4(), serialNumber: 'serial-number-4' }]);
    await inventoryService.deleteItemBySerialNumber('serial-number-4');

    expect(await collection.findOne({ serialNumber: 'serial-number-4' })).toBeNull();
  });

  it('can retrieve items', async () => {
    await collection.insertMany([
      { id: v4(), serialNumber: 'serial-number-5' },
      { id: v4(), serialNumber: 'serial-number-6' },
      { id: v4(), serialNumber: 'serial-number-7' },
    ]);

    const items = await inventoryService.retrieveItems(2);

    expect(await collection.find().count()).toBe(1);
    expect(items.length).toBe(2);
    expect(items[0].serialNumber).toBe('serial-number-5');
    expect(items[1].serialNumber).toBe('serial-number-6');
  });

  it('throw error when stock is not available', async () => {
    await collection.insertMany([
      { id: v4(), serialNumber: 'serial-number-8' },
      { id: v4(), serialNumber: 'serial-number-9' },
    ]);

    try {
      await inventoryService.retrieveItems(3);
    } catch (error) {
      expect(error).toBeInstanceOf(LowStockError);
    }
  });
});
