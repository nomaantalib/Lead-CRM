const router = require("express").Router();
const Lead = require("../models/Lead");
const aiAgent = require("../ai/leadAgent");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const ai = await aiAgent(req.body);
  const lead = await Lead.create({ ...req.body, ...ai });
  res.json(lead);
});

router.get("/", auth, async (_, res) => {
  res.json(await Lead.find());
});

module.exports = router;
