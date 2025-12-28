const Lead = require("../models/Lead");
const aiAgent = require("../ai/leadAgent");

exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLead = async (req, res) => {
  try {
    const ai = await aiAgent(req.body);
    const lead = new Lead({ ...req.body, ...ai });
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
