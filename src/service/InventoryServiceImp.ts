import { InventoryService } from './InventoryService';
import { ItemDataSource } from '../dataSources/ItemDataSource';
import { Item } from './Item';
import { v4 } from 'uuid';
import { DuplicateSerialNumberError, LowStockError, RetrieveQuantityError } from '../errors';

const maxQuantity = 3;

export class InventoryServiceImp extends InventoryService {
  itemDataSource: ItemDataSource;
  soldItemDataSource: ItemDataSource;

  constructor(itemDataSource: ItemDataSource, soldItemDataSource: ItemDataSource) {
    super(itemDataSource, soldItemDataSource);
    this.itemDataSource = itemDataSource;
    this.soldItemDataSource = soldItemDataSource;
  }

  getItemQuantity(): Promise<number> {
    return this.itemDataSource.getItemQuantity();
  }

  async addItem(item: Item, itemDataSource: ItemDataSource): Promise<Item | DuplicateSerialNumberError> {
    const itemInStock = await itemDataSource.getItemBySerialNumber(item.serialNumber);
    if (itemInStock) {
      return Promise.resolve(new DuplicateSerialNumberError(item.serialNumber));
    }

    return await itemDataSource.insertItem({ id: v4(), ...item });
  }

  async returnItem(item: Item): Promise<Item | DuplicateSerialNumberError> {
    const soldItem = await this.soldItemDataSource.getItemBySerialNumber(item.serialNumber);
    if (soldItem) {
      await this.addItem(soldItem, this.itemDataSource);
      await this.soldItemDataSource.deleteItemBySerialNumber(soldItem.serialNumber);
    }

    return await this.addItem(item, this.itemDataSource);
  }

  deleteItemBySerialNumber(serialNumber: String): Promise<any> {
    return this.itemDataSource.deleteItemBySerialNumber(serialNumber);
  }

  async retrieveItems(quantity: number): Promise<Item[] | RetrieveQuantityError | LowStockError> {
    if(quantity > maxQuantity || quantity <= 0) {
      return Promise.resolve(new RetrieveQuantityError());
    }

    const items = await this.itemDataSource.getItems(quantity);
    if(items.length < quantity) {
      return Promise.resolve(new LowStockError(items.length));
    }

    items.map(item => this.deleteItemBySerialNumber(item.serialNumber));
    items.map(item => this.addItem({ serialNumber: item.serialNumber }, this.soldItemDataSource));
    return items;
  }
}
