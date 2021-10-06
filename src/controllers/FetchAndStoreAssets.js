const collectionsHashes = require("../../final_data_slug.json");
const Status = require("./status");
const logStatus = new Status();
const Asset = require("../models/Asset");
const Collection = require("../models/Collection");
const {
  getAssetsByHash,
  getCollectionDetailsByHash,
} = require("../external-service/openSea");
const statusCode = require("../utilities/statusCode");
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
const fetchAndStoreAssets = async (req, res) => {
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
