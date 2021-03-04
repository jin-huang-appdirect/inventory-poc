import { ItemDataSource } from '../dataSources/ItemDataSource';
import { Item } from './Item';

export abstract class InventoryService {
  protected constructor(itemDataSource: ItemDataSource) {}
  abstract getItemQuantity(): Promise<Number>;
  abstract async addItem(item: Item): Promise<Item>;
  abstract deleteItemBySerialNumber(serialNumber: String): Promise<any>;
}
