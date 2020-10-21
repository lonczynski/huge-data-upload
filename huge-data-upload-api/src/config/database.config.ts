const databaseConfig = {
  endpoint: "https://treinamento-cosmosdb.documents.azure.com:443/",
  key: "KEY",
  partitionKey: { kind: "Hash", paths: ["/category"] },
};

export default databaseConfig;
