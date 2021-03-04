export interface ItemDataSource {
  getItemQuantity(): Promise<Number>;
}
