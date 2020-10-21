import express from "express";
import { Chunk } from "../models/Chunk";
import StorageService from "../services/storage";
const router = express.Router();

router.post("/containers/:containerName", async (req, res) => {
  const storageService = new StorageService(req.params.containerName);

  try {
    const createdContainer = await storageService.createContainer();

    res.status(201).send(createdContainer);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.delete("/containers/:containerName", async (req, res) => {
  const storageService = new StorageService(req.params.containerName);

  try {
    await storageService.deleteContainer();

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/containers", async (req, res) => {
  const storageService = new StorageService(req.params.containerName);

  try {
    const containers = await storageService.getContainers();

    res.send(containers);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/containers/:containerName/blobs/:blobId", async (req, res) => {
  const storageService = new StorageService(req.params.containerName);

  try {
    const chunkStart = req.body.start;
    const chunkEnd = req.body.end;
    const fileExtension = req.body.fileExtension;

    const createdBlob = await storageService.createBlob(
      req.params.blobId,
      fileExtension,
      chunkStart,
      chunkEnd
    );
    res.status(201).send(createdBlob);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/containers/:containerName/blobs/:blobId", async (req, res) => {
  const storageService = new StorageService(req.params.containerName);

  try {
    const returnedBlob: any = await storageService.getBlobsById(req.params.blobId);

    res.send(returnedBlob);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
