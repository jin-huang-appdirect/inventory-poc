export class UserError {
  public readonly message: string;
  public readonly __typename: string;

  constructor(message: string) {
    this.message = message;
    this.__typename = this.constructor.name;
  }
}

export class DuplicateSerialNumberError extends UserError {
  constructor(serialNumber: String) {
    super(`Product with serial number: ${serialNumber} already exists `);
  }
}

export class LowStockError extends UserError {
  constructor(quantity: number) {
    super(`There are only ${quantity} left. `);
  }
}

export class RetrieveQuantityError extends UserError {
  constructor() {
    super('Retrieve quantity should be between 0 and 3 ');
  }
}
