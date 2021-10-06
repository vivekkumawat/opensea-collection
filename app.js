const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;

const collectionsHashes = require("./final_data_slug.json");
const Status = require("./src/controllers/status");
const logStatus = new Status();
const Asset = require("./src/models/Asset");
const Collection = require("./src/models/Collection");
const {
  getAssetsByHash,
  getCollectionDetailsByHash,
} = require("./src/external-service/openSea");
const statusCode = require("./src/utilities/statusCode");

// Connect to MongoDB ATLAS
mongoose.connect(
  process.env.DB_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (error) {
      console.log("Unable to connect to DB " + error);
    }
    console.log("Connected to DB Successfully");
  }
);

// Parse JSON req/res
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/status", (req, res) => {
  apiStatus(req, res);
});

// Console Log The Requested Endpoint URL
app.use("/", (req, res, next) => {
  console.log(`API Call from: ${req.originalUrl}`);
  next();
});

app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
const fetchAndStoreAssets = async () => {
  try {
    for (const collection of collectionsHashes.collection) {
      const collectionHash = collection.contracts[0].contract;
      const fetchForTokenId = await getAssetsByHash(
        collectionHash,
        "pk",
        "asc",
        0,
        1
      );
      const collectionDetails = await getCollectionDetailsByHash(
        collectionHash,
        fetchForTokenId.assets[0].token_id
      );

      await Collection.create({
        collection_hash: collectionHash,
        collection_details: collectionDetails,
      });

      const noOfCalls = Math.ceil(
        collectionDetails.collection.stats.total_supply / 50
      );
      let offset = 0;
      for (let i = 1; i <= noOfCalls; i++) {
        const asset = await getAssetsByHash(
          collectionHash,
          "pk",
          "asc",
          offset,
          50
        );
        if (asset) {
          for (const nft of asset.assets) {
            Asset.create({
              collection_hash: nft.asset_contract.address,
              asset: nft,
            });
          }
          logStatus.updateStatus("true", 0, i);
          await sleep(5000);
        }
        offset += 50;
      }
    }
  } catch (error) {
    logStatus.updateStatus("false", 1, 0);
    console.log(error);
  }
};

fetchAndStoreAssets();

const apiStatus = async (req, res) => {
  const currentStatus = logStatus.getStatus();
  return res.status(statusCode.success.code).json({
    currentStatus,
  });
};

module.exports = {
  fetchAndStoreAssets,
  apiStatus,
};
