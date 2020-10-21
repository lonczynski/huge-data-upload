import express from "express";
const storageController = require("./controllers/storage");
const databaseController = require("./controllers/database");
const configController = require("./controllers/config");
const cors = require("cors");
const multer = require("multer");
const upload = multer();

const app = express();

const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.single("file"));
app.use(express.static("public"));

app.use("/storage", storageController);
app.use("/database", databaseController);
app.use("/config", configController);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
