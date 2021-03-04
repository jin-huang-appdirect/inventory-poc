import { InventoryServer } from './InventoryServer';
import { InventoryApolloApplication } from './InventoryApolloApplication';
import express from 'express';
import { default as expressPlayground } from 'graphql-playground-middleware-express';
import * as bodyParser from 'body-parser';
import * as http from 'http';

const graphqlPath = '/api/graphql';

export class InventoryApplication extends InventoryApolloApplication{
  app: express.Application;
  server: InventoryServer;
  httpServer: http.Server;
  port: number;

  constructor(server: InventoryServer, port: number) {
    super(server, port);
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.get('/playground', expressPlayground({ endpoint: graphqlPath }));
    this.server = server;
    this.server.applyMiddleware({
      app: this.app,
      path: graphqlPath,
    });
    this.port = port;
  }

  async start(): Promise<void> {
    await this.server.openConnections();
    this.httpServer = await this.app.listen({ port: this.port });
  }

  async stop(): Promise<void> {
    await this.httpServer.close();
    await this.server.closeConnections();
    this.httpServer = null;
  }
}
