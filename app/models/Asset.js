const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Asset", AssetSchema);
