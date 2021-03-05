import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';
import { Collection, MongoClient } from 'mongodb';
import { v4 } from 'uuid';
import { ItemMongoDataSource } from '../../src/dataSources/ItemMongoDataSource';
import { InventoryServiceImp } from '../../src/service/InventoryServiceImp';
import { InventoryService } from '../../src/service/InventoryService';
import { DuplicateSerialNumberError, LowStockError, RetrieveQuantityError } from '../../src/errors';

describe('inventory service', () => {
  let connection: MongoClient, collection: Collection, soldCollection: Collection;
  let itemMongoDataSource: ItemMongoDataSource, soldItemMongoDataSource: ItemMongoDataSource;
  let inventoryService: InventoryService;

  beforeAll(async () => {
    const configuration = new InventoryServerConfiguration('test-db', 9000);
    const client = new MongoClient(configuration.mongoUrl.toString(),  { useUnifiedTopology: true });
    connection = await client.connect();
    collection = connection.db('test-db').collection<any>('service-test');
    soldCollection = connection.db('test-db').collection<any>('service-test-sold');

    itemMongoDataSource = new ItemMongoDataSource(collection);
    soldItemMongoDataSource = new ItemMongoDataSource(soldCollection);
    inventoryService = new InventoryServiceImp(itemMongoDataSource, soldItemMongoDataSource);
  });

  beforeEach(async () => {
    await collection.deleteMany({});
    await soldCollection.deleteMany({});
  });

  afterAll(async () => await connection.close());

  it('can query item quantity', async () => {
    await collection.insertMany([{ id: v4(), serialNumber: 'serial-number-1' }]);

    expect(await inventoryService.getItemQuantity()).toEqual(1);
  });

  it('can add item', async () => {
    await inventoryService.addItem({ serialNumber: 'serial-number-2' }, itemMongoDataSource);
    expect(await collection.find().count()).toEqual(1);
  });

  it('can add item into sold collection', async () => {
    await inventoryService.addItem({ serialNumber: 'serial-number-2' }, soldItemMongoDataSource);
    expect(await soldCollection.find().count()).toEqual(1);
  });

  it('return error when item already exists', async () => {
      await inventoryService.addItem({ serialNumber: 'serial-number-3' }, itemMongoDataSource);
      expect(await inventoryService.addItem({ serialNumber: 'serial-number-3' }, itemMongoDataSource)).toBeInstanceOf(DuplicateSerialNumberError);
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

    await inventoryService.retrieveItems(2);
    expect(await collection.find().count()).toBe(1);
    expect(await soldCollection.find().count()).toBe(2);
  });

  it('return error when stock is not available', async () => {
    await collection.insertMany([
      { id: v4(), serialNumber: 'serial-number-8' },
      { id: v4(), serialNumber: 'serial-number-9' },
    ]);

    expect(await inventoryService.retrieveItems(3)).toBeInstanceOf(LowStockError);
  });

  it('return error when retrieved quantity exceed 3', async () => {
    await collection.insertMany([
      { id: v4(), serialNumber: 'serial-number-8' },
      { id: v4(), serialNumber: 'serial-number-9' },
    ]);

    expect(await inventoryService.retrieveItems(4)).toBeInstanceOf(RetrieveQuantityError);
  });

  it('return error when retrieved quantity equals 0', async () => {
    await collection.insertMany([
      { id: v4(), serialNumber: 'serial-number-8' },
      { id: v4(), serialNumber: 'serial-number-9' },
    ]);

    expect(await inventoryService.retrieveItems(0)).toBeInstanceOf(RetrieveQuantityError);
  });

  it('can return item when item exist in sold collection', async () => {
    await soldCollection.insertMany([
      { id: v4(), serialNumber: 'serial-number-10' },
      { id: v4(), serialNumber: 'serial-number-11' },
    ]);

    await inventoryService.returnItem({ serialNumber: 'serial-number-10' });

    expect(await soldCollection.find({ serialNumber: 'serial-number-10' }).count()).toEqual(0);
    expect(await collection.find({ serialNumber: 'serial-number-10' }).count()).toEqual(1);
  });


  it('can add item when item not exist in sold collection', async () => {
    await inventoryService.returnItem({ serialNumber: 'serial-number-14' });

    expect(await soldCollection.find({ serialNumber: 'serial-number-14' }).count()).toEqual(0);
    expect(await collection.find({ serialNumber: 'serial-number-14' }).count()).toEqual(1);
  });
});
