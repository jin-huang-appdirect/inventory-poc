import { InventoryService } from './InventoryService';
import { ItemDataSource } from '../dataSources/ItemDataSource';

export class InventoryServiceImp extends InventoryService {
  itemDataSource: ItemDataSource;

  constructor(itemDataSource: ItemDataSource) {
    super(itemDataSource);
    this.itemDataSource = itemDataSource;
  }

  getItemQuantity(): Promise<Number> {
    return this.itemDataSource.getItemQuantity();
  }
}
