import { ModelOrCollection, MongoDataSource } from 'apollo-datasource-mongodb';
import { ItemDataSource } from './ItemDataSource';
import { ItemEntity } from './ItemEntity';

export class ItemMongoDataSource extends MongoDataSource<any, any> implements ItemDataSource {
  constructor(collection: ModelOrCollection<ItemEntity>) {
    super(collection);
  }
  getItemQuantity(): Promise<Number> {
    return this.collection.count().then(number => number);
  }
}
