import { ItemDataSource } from '../dataSources/ItemDataSource';
import { Item } from './Item';
import { DuplicateSerialNumberError, LowStockError, RetrieveQuantityError } from '../errors';

export abstract class InventoryService {
  protected constructor(itemDataSource: ItemDataSource) {}
  abstract getItemQuantity(): Promise<number>;
  abstract async addItem(item: Item): Promise<Item | DuplicateSerialNumberError>;
  abstract deleteItemBySerialNumber(serialNumber: string): Promise<any>;
  abstract async retrieveItems(quantity: number): Promise<Item[] | RetrieveQuantityError | LowStockError>;
}
