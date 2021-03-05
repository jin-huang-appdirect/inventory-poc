import { InventoryService } from './InventoryService';
import { ItemDataSource } from '../dataSources/ItemDataSource';
import { Item } from './Item';
import { v4 } from 'uuid';
import { DuplicateSerialNumberError, LowStockError, RetrieveQuantityError } from '../errors';

const maxQuantity = 3;

export class InventoryServiceImp extends InventoryService {
  itemDataSource: ItemDataSource;

  constructor(itemDataSource: ItemDataSource) {
    super(itemDataSource);
    this.itemDataSource = itemDataSource;
  }

  getItemQuantity(): Promise<Number> {
    return this.itemDataSource.getItemQuantity();
  }

  async addItem(item: Item): Promise<Item | DuplicateSerialNumberError> {
    if (await this.itemDataSource.getItemBySerialNumber(item.serialNumber)) {
      return Promise.resolve(new DuplicateSerialNumberError(item.serialNumber));
    }

    return await this.itemDataSource.insertItem({ id: v4(), ...item });
  }

  deleteItemBySerialNumber(serialNumber: String): Promise<any> {
    return this.itemDataSource.deleteItemBySerialNumber(serialNumber);
  }

  async retrieveItems(quantity: number): Promise<Item[]> {
    if(quantity > maxQuantity) {
      throw new RetrieveQuantityError();
    }

    const items = await this.itemDataSource.getItems(quantity);
    if(items.length < quantity) {
      throw new LowStockError(items.length);
    }

    items.map(item => this.deleteItemBySerialNumber(item.serialNumber));
    return items;
  }
}
