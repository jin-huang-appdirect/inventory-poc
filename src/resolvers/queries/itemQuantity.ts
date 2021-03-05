import { InventoryServerContext } from '../../server/InventoryServerContext';

export async function itemQuantity(parent: any, args: null, { inventoryService }: InventoryServerContext): Promise<number> {

  return await inventoryService.getItemQuantity();
}
