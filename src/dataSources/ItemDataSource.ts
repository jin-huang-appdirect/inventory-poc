import { ItemEntity } from './ItemEntity';

export interface ItemDataSource {
  getItemQuantity(): Promise<Number>;
  getItems(quantity: number): Promise<ItemEntity[]>;
  insertItem(item: ItemEntity): Promise<ItemEntity>;
  deleteItemById(id: String): Promise<any>;
}
