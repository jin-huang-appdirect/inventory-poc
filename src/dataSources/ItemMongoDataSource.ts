import { ModelOrCollection, MongoDataSource } from 'apollo-datasource-mongodb';
import { ItemDataSource } from './ItemDataSource';
import { ItemEntity } from './ItemEntity';

export class ItemMongoDataSource extends MongoDataSource<ItemEntity, any> implements ItemDataSource {
  constructor(collection: ModelOrCollection<ItemEntity>) {
    super(collection);
  }

  getItemQuantity(): Promise<Number> {
    return this.collection.count().then(number => number);
  }

  getItems(quantity: number): Promise<ItemEntity[]> {
    return this.collection.find().sort({ serialNumber: 1 }).limit(quantity).toArray();
  }

  insertItem(item: ItemEntity): Promise<ItemEntity> {
    return this.collection.insertOne(item).then(() => item);
  }

  deleteItemBySerialNumber(serialNumber: string): Promise<any> {
    return this.collection.deleteOne({ serialNumber });
  }
}
