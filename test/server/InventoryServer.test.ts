import { InventoryServer } from '../../src/server/InventoryServer';
import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';
import { ApolloServer } from 'apollo-server';

const configuration = new InventoryServerConfiguration('test-db', 9000);

describe('inventory server', () => {
  let server: InventoryServer;

  beforeAll(() => {
    server = new InventoryServer(configuration);
  });
  it('constructor initialize server as apollo server', () => {
    expect(server).toBeInstanceOf(ApolloServer);
  });

  it('create mongo client', () => {

  });
});
