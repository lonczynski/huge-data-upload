import { BlobItem, BlobServiceClient, ContainerItem, HttpRequestBody } from "@azure/storage-blob";
import DatabaseService from "./database";

const CONNECTION_STRING = "";

class StorageService {
  private containerName: string = "";
  private databaseService: DatabaseService;

  constructor(containerName: string) {
    this.containerName = containerName;
    this.databaseService = new DatabaseService();
  }

  public async createContainer() {
    const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);

    const containerClient = blobServiceClient.getContainerClient(this.containerName);

    return await containerClient.create();
  }

  public async deleteContainer() {
    const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);

    await blobServiceClient.deleteContainer(this.containerName);
  }

  public async getContainers() {
    const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
    const containers: ContainerItem[] = [];

    for await (const container of blobServiceClient.listContainers()) {
      containers.push(container);
    }

    return containers;
  }

  public async createBlob(blobId: string, fileExtension: string, startAt: number, endAt: number) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(this.containerName);

    const blobName = `${blobId}-${startAt}-${endAt}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    this.databaseService.createItem("chunks", "container", {
      filename: blobId,
      startAt,
      endAt,
      extension: fileExtension,
      blobUrl: blockBlobClient.url,
    });

    return blockBlobClient;
  }

  public async getBlobsById(id: string) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(this.containerName);

    const blobsIterator = containerClient.listBlobsFlat({ prefix: id });

    const blobRefs: BlobItem[] = [];
    for await (const blobIterator of blobsIterator) {
      blobRefs.push(blobIterator);
    }

    const blobsPromises = [];
    for (const blob of blobRefs) {
      blobsPromises.push(this.getBlobByName(blob.name));
    }

    const { filename, extension } = await this.databaseService.getItem("chunks", "container", blobsPromises[0].blobUrl);

    return {
      blobs: blobsPromises,
      fileName: filename,
      fileExtension: extension,
    };
  }

  private getBlobByName(blobName: string) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(this.containerName);

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    return {
      startAt: Number(blobName.split("-")[1]),
      blobUrl: blockBlobClient.url,
    };
  }
}

export default StorageService;
