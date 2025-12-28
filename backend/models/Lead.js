const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Lead",
  new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    score: Number,
    priority: String,
    action: String,
    stage: { type: String, default: "Prospect" }, // Sales pipeline stages
    company: String,
    phone: String,
  })
);
