import { InventoryServiceImp } from '../../service/InventoryServiceImp';
import { UserError } from '../../errors';
import { Item } from '../../service/Item';

type ItemCreateArgs = {
  serialNumber: string;
}

type ItemCreatePayload = {
  item?: Item;
  userErrors?: UserError[];
}

export async function itemCreate(parent: any, { serialNumber }: ItemCreateArgs, { dataSources: { items, soldItems } }: any): Promise<ItemCreatePayload> {

  const service  = new InventoryServiceImp(items, soldItems);
  const response  = await service.addItem({ serialNumber }, items);
  if(response instanceof UserError) {
    return { item: null, userErrors: [response] };
  }

  return { item: { serialNumber: response.serialNumber }, userErrors: null };
}
