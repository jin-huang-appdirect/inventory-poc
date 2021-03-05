import { ItemEntity } from './ItemEntity';

export interface ItemDataSource {
  getItemQuantity(): Promise<number>;
  getItems(quantity: number): Promise<ItemEntity[]>;
  getItemBySerialNumber(serialNumber: String): Promise<ItemEntity>;
  insertItem(item: ItemEntity): Promise<ItemEntity>;
  deleteItemBySerialNumber(serialNumber: String): Promise<any>;
}
