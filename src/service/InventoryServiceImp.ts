import { InventoryService } from './InventoryService';
import { ItemDataSource } from '../dataSources/ItemDataSource';
import { Item } from './Item';
import { v4 } from 'uuid';
import { DuplicateSerialNumberError } from '../errors';

export class InventoryServiceImp extends InventoryService {
  itemDataSource: ItemDataSource;

  constructor(itemDataSource: ItemDataSource) {
    super(itemDataSource);
    this.itemDataSource = itemDataSource;
  }

  getItemQuantity(): Promise<Number> {
    return this.itemDataSource.getItemQuantity();
  }

  async addItem(item: Item): Promise<Item> {
    if (await this.itemDataSource.getItemBySerialNumber(item.serialNumber)) {
      throw new DuplicateSerialNumberError(item.serialNumber);
    }

    return await this.itemDataSource.insertItem({ id: v4(), ...item });
  }

  deleteItemBySerialNumber(serialNumber: String): Promise<any> {
    return this.itemDataSource.deleteItemBySerialNumber(serialNumber);
  }
}
