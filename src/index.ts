import { InventoryServer } from './server/InventoryServer';
import { InventoryApplication } from './server/InventoryApplication';
import { InventoryServerConfiguration } from './server/InventoryServerConfiguration';

const configuration: InventoryServerConfiguration = new InventoryServerConfiguration('inventory', 8000);
const application: InventoryApplication = new InventoryApplication(new InventoryServer(configuration), configuration.port);

application.start().then(() => {
  console.log('Inventory service is running');
});
