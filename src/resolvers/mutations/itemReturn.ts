import { UserError } from '../../errors';
import { Item } from '../../service/Item';
import { InventoryServerContext } from '../../server/InventoryServerContext';

type ItemCreateArgs = {
  serialNumber: string;
}

type ItemCreatePayload = {
  item?: Item;
  userErrors?: UserError[];
}

export async function itemReturn(parent: any, { serialNumber }: ItemCreateArgs, { inventoryService }: InventoryServerContext): Promise<ItemCreatePayload> {

  const response  = await inventoryService.returnItem({ serialNumber });
  if(response instanceof UserError) {
    return { item: null, userErrors: [response] };
  }

  return { item: { serialNumber: response.serialNumber }, userErrors: null };
}
