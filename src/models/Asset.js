const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  collection_hash: {
    type: String,
    required: true,
    max: 255,
  },
  asset: { type: Object, default: {} },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Asset", assetSchema);
