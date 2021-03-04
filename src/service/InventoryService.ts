import { ItemDataSource } from '../dataSources/ItemDataSource';

export abstract class InventoryService {
  protected constructor(itemDataSource: ItemDataSource) {}
  abstract getItemQuantity(): Promise<Number>;
}
