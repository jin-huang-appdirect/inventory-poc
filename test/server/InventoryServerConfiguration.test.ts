import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';

describe('inventory server configuration', () => {
  let configuration: InventoryServerConfiguration;

  beforeAll(() => {
    configuration = new InventoryServerConfiguration('test-db', 9000);
  });
  it('initialize mongo url', () => {
    expect(configuration.mongoUrl.toString()).toBe('mongodb://localhost:27017/?retryWrites=true');
  });

  it('initialize db name', () => {
    expect(configuration.dbName).toBe('test-db');
  });

  it('initialize port', () => {
    expect(configuration.port).toBe(9000);
  });
});
