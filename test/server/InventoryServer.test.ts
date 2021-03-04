import { InventoryServer } from '../../src/server/InventoryServer';
import { InventoryServerConfiguration } from '../../src/server/InventoryServerConfiguration';
import { ApolloServer } from 'apollo-server';
import { Db, MongoClient } from 'mongodb';

const configuration = new InventoryServerConfiguration('test-db', 9000);

describe('inventory server', () => {
  let server: InventoryServer;

  beforeAll(async () => {
    server = new InventoryServer(configuration);
    await server.openConnections();
  });

  afterAll(async () => await server.closeConnections());

  it('initialize server as apollo server', () => {
    expect(server).toBeInstanceOf(ApolloServer);
  });

  it('initialize server configuration', () => {
    expect(server.configuration).toBeInstanceOf(InventoryServerConfiguration);
  });

  it('create mongo client', () => {
    expect(server.connection).toBeInstanceOf(MongoClient);
  });

  it('initialize db', () => {
    expect(server.db).toBeInstanceOf(Db);
  });
});
