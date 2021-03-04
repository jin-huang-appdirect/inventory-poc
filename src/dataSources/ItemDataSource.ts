export interface ItemDataSource {
  getInventoryQuantity(): Promise<Number>;
}
