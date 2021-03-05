import { TestApplication } from '../TestApplication';
import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';
import { DuplicateSerialNumberError } from '../../src/errors';

const configuration = new InventoryServerConfiguration('inventory-e2e-create-item', Math.floor(Math.random()*10000));

describe('create item', () => {
  const testApp = new TestApplication(configuration);

  beforeAll(async () => await testApp.start());

  beforeAll(async () => await testApp.clearDb());

  afterAll(async () => await testApp.stop());

  it('return newly added item', async () => {
    const payload = await testApp.client.create('test-serial-number-1');
    expect(payload.item.serialNumber).toBe('test-serial-number-1');
  });

  it('return error when try to create item with duplicate serial number', async () => {
    await testApp.client.create('test-serial-number-2').then(payload => payload.userErrors);
    const userErrors = await testApp.client.create('test-serial-number-2').then(payload => payload.userErrors);
    expect(userErrors[0].__typename).toBe(DuplicateSerialNumberError.name);
  });
});
