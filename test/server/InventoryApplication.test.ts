import { InventoryApplication } from '../../src/server/InventoryApplication';
import { InventoryServer } from '../../src/server/InventoryServer';
import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';

const configuration = new InventoryServerConfiguration('test-db', 9000);

describe('inventory application', () => {
  let application: InventoryApplication;

  beforeAll(async () => {
    application =  new InventoryApplication(new InventoryServer(configuration), configuration.port);
    await application.start();
  });

  afterAll(async () => await application.stop());

  it('initialize inventory application when application started', () => {
    expect(application).toBeInstanceOf(InventoryApplication);
  });

  it('initialize inventory server when application started', () => {
    expect(application.server).toBeInstanceOf(InventoryServer);
  });

  it('initialize listening port when application started', () => {
    expect(application.port).toBe(9000);
  });
});
