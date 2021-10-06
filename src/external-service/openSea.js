const axios = require("axios");

const getAssetsByHash = async (
  hash,
  orderBy,
  orderDirection,
  offset,
  limit
) => {
  const url = `https://api.opensea.io/api/v1/assets?asset_contract_address=${hash}&order_by=${orderBy}&order_direction=${orderDirection}&offset=${offset}&limit=${limit}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getCollectionDetailsByHash = async (hash, tokenId) => {
  const url = `https://api.opensea.io/api/v1/asset/${hash}/${tokenId}/`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAssetsByHash,
  getCollectionDetailsByHash,
};
