import express from "express";
const router = express.Router();

router.get("/blobs/connection-string", async (req, res) => {
  try {
    const connectionString =
      "sv=2019-12-12&ss=b&srt=sco&sp=rwdlac&se=2024-09-01T09:12:50Z&st=2020-10-06T01:12:50Z&spr=https,http&sig=D%2FLicHC01s7NES%2BPlCzXHQlpoVGyRTYGqknOGA4DZR8%3D";

    res.status(200).send({
      connectionString,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
