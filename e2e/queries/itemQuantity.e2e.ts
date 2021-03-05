import { TestApplication } from '../TestApplication';
import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';

const configuration = new InventoryServerConfiguration('inventory-e2e-query-quantity', Math.floor(Math.random()*10000));

describe('item quantity', () => {
  const testApp = new TestApplication(configuration);

  beforeAll(async () => await testApp.start());

  beforeAll(async () => await testApp.clearDb());

  afterAll(async () => await testApp.stop());

  it('return the quantity of items', async () => {
    await testApp.client.create('test-serial-number-1');
    expect(await testApp.client.queryQuantity()).toBe(1);
  });
});
