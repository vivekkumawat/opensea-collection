const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  collection_hash: {
    type: String,
    required: true,
    max: 255,
  },
  collection_details: { type: Object, default: {} },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Collection", collectionSchema);
