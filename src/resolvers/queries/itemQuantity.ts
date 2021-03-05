import { InventoryServiceImp } from '../../service/InventoryServiceImp';

export async function itemQuantity(parent: any, args: null, { dataSources: { items, soldItems } }: any): Promise<number> {

  const service  = new InventoryServiceImp(items, soldItems);
  return await service.getItemQuantity();
}
