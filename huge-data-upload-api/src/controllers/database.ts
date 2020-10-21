import express from "express";
import DatabaseService from "../services/database";
const router = express.Router();

router.post("/:databaseId", async (req, res) => {
  const databaseService = new DatabaseService();

  const answ = await databaseService.createDatabase(req.params.databaseId);

  res.send(answ);
});

router.post("/:databaseId/containers/:containerId", async (req, res) => {
  const databaseService = new DatabaseService();

  const answ = await databaseService.createContainer(req.params.databaseId, req.params.containerId);

  res.send(answ);
});

router.post("/:databaseId/containers/:containerId/items", async (req, res) => {
  const databaseService = new DatabaseService();

  const answ = await databaseService.createItem(
    req.params.databaseId,
    req.params.containerId,
    req.body
  );

  res.send(answ);
});

module.exports = router;
