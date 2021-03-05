import { UserError } from '../../errors';
import { InventoryServerContext } from '../../server/InventoryServerContext';

type ItemArgs = {
  quantity: number;
}

type ItemRetrievePayload = {
  serialNumbers?: Object[];
  userErrors?: UserError[];
}

export async function itemRetrieve(parent: any, { quantity }: ItemArgs, { inventoryService }: InventoryServerContext): Promise<ItemRetrievePayload | null> {

  const response  = await inventoryService.retrieveItems(quantity);

  if(response instanceof UserError) {
    return { serialNumbers: null, userErrors: [response] };
  }

  return { serialNumbers: response.map((res: any) => res.serialNumber), userErrors: null };
}
