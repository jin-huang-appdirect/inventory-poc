import { LowStockError, RetrieveQuantityError, UserError } from '../../errors';
import { InventoryServiceImp } from '../../service/InventoryServiceImp';

type ItemArgs = {
  quantity: number;
}

type ItemRetrievePayload = {
  serialNumbers?: Object[];
  userErrors?: UserError[];
}

export async function itemRetrieve(parent: any, { quantity }: ItemArgs, { dataSources: { items, soldItem } }: any): Promise<ItemRetrievePayload | null>{

  const service  = new InventoryServiceImp(items, soldItem);
  const response  = await service.retrieveItems(quantity);

  if(response instanceof RetrieveQuantityError || response instanceof LowStockError) {
    return { serialNumbers: null, userErrors: [response] };
  }

  return { serialNumbers: response.map(res => res.serialNumber), userErrors: null };
}
