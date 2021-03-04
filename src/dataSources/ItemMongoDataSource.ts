import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ItemDataSource } from './ItemDataSource';

export class ItemMongoDataSource extends MongoDataSource<any, any> implements ItemDataSource {
  getInventoryQuantity(): Promise<Number> {
    return null;
  }
}
