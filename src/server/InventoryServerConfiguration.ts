// simply put local url here since this is only POC and we do no have to deal with production env
const mongoUrl = new URL('mongodb://localhost:27017/?retryWrites=true');

export class InventoryServerConfiguration {
  mongoUrl: URL;
  dbName: string;
  port: number;

  constructor(dbName: string, port: number) {
    this.dbName = dbName;
    this.mongoUrl = mongoUrl;
    this.port = port;
  }
}
