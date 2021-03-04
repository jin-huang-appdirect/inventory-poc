import { ItemEntity } from './ItemEntity';

export interface ItemDataSource {
  getItemQuantity(): Promise<Number>;
  insertItem(item: ItemEntity): Promise<ItemEntity>;
  deleteItemById(id: String): Promise<any>;
}
