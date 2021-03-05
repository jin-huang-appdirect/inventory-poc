import { InventoryServiceImp } from '../../service/InventoryServiceImp';

export async function itemQuantity(parent: any, args: null, { dataSources: { items } }: any): Promise<number> {

  const service  = new InventoryServiceImp(items);
  return await service.getItemQuantity();
}
