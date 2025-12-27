const router = require("express").Router();
const Lead = require("../models/Lead");
const aiAgent = require("../ai/leadAgent");

router.post("/", async (req, res) => {
  const ai = await aiAgent(req.body);
  const lead = await Lead.create({ ...req.body, ...ai });
  res.json(lead);
});

router.get("/", async (_, res) => {
  res.json(await Lead.find());
});

module.exports = router;
