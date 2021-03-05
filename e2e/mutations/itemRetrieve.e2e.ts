import { TestApplication } from '../TestApplication';
import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';
import { LowStockError, RetrieveQuantityError } from '../../src/errors';

const configuration = new InventoryServerConfiguration('inventory-e2e-retrieve-item', Math.floor(Math.random()*10000));

describe('retrieve item', () => {
  const testApp = new TestApplication(configuration);

  beforeAll(async () => {
    await testApp.start();
    await testApp.clearDb();
    await testApp.client.create('test-serial-number-1');
    await testApp.client.create('test-serial-number-2');
    await testApp.client.create('test-serial-number-3');
    await testApp.client.create('test-serial-number-4');
  });

  afterAll(async () => await testApp.stop());

  it('retrieve product when stock is available', async () => {
    const payload = await testApp.client.retrieve(3);
    expect(payload.serialNumbers.length).toBe(3);
  });

  it('cannot retrieve when user retrieve number is more than 3 ', async () => {
    const userErrors = await testApp.client.retrieve(4).then(payload => payload.userErrors);
    expect(userErrors[0].__typename).toBe(RetrieveQuantityError.name);
  });

  it('cannot retrieve when user retrieve number is less than 0 ', async () => {
    const userErrors = await testApp.client.retrieve(-1).then(payload => payload.userErrors);
    expect(userErrors[0].__typename).toBe(RetrieveQuantityError.name);
  });

  it('cannot retrieve when user retrieve number is equal 0 ', async () => {
    const userErrors = await testApp.client.retrieve(0).then(payload => payload.userErrors);
    expect(userErrors[0].__typename).toBe(RetrieveQuantityError.name);
  });

  it('cannot retrieve when user retrieve number more than stock available ', async () => {
    const userErrors = await testApp.client.retrieve(3).then(payload => payload.userErrors);
    expect(userErrors[0].__typename).toBe(LowStockError.name);
  });
});
