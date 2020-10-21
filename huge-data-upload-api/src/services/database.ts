import databaseConfig from "../config/database.config";
import { CosmosClient } from "@azure/cosmos";

class DatabaseService {
  private client: CosmosClient;

  constructor() {
    const { endpoint, key } = databaseConfig;

    this.client = new CosmosClient({ endpoint, key });
  }

  public async createDatabase(databaseId: string) {
    const { database } = await this.client.databases.createIfNotExists({
      id: databaseId,
    });
    console.log(`Created database:\n${database.id}\n`);
  }

  public async createContainer(databaseId: string, containerId: string) {
    const partitionKey = databaseConfig.partitionKey;

    const { container } = await this.client
      .database(databaseId)
      .containers.createIfNotExists({ id: containerId, partitionKey }, { offerThroughput: 400 });

    console.log(`Created container:\n${container.id}\n`);
  }

  public async createItem(databaseId: string, containerId: string, item: object) {
    const database = this.client.database(databaseId);
    const container = database.container(containerId);

    const { resource: createdItem } = await container.items.create(item);

    return createdItem;
  }

  public async getItem(databaseId: string, containerId: string, blobUrl: string) {
    const database = this.client.database(databaseId);
    const container = database.container(containerId);

    const { resources: item } = await container.items
      .query(`SELECT * FROM Items where Items.blobUrl = '${blobUrl}'`)
      .fetchAll();

    return item.length > 0 ? item[0] : { filename: "", extension: "" };
  }
}

export default DatabaseService;
