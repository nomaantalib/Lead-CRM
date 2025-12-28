const router = require("express").Router();
const leadController = require("../controllers/leadController");
const auth = require("../middleware/auth");

router.get("/", auth, leadController.getAllLeads);
router.post("/", auth, leadController.createLead);
router.put("/:id", auth, leadController.updateLead);
router.put("/:id/score", auth, leadController.rescoreLead);

module.exports = router;
