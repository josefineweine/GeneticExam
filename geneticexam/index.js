// Setup: npm install alchemy-sdk dotenv
require('dotenv').config();
const { Network, Alchemy } = require("alchemy-sdk");

// Use the API key stored in .env for security
const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,  // Set your Alchemy API key here in .env file
    network: Network.ETH_SEPOLIA, // Use Sepolia testnet here, or choose another network if needed
};

const alchemy = new Alchemy(settings);

async function main() {
  try {
    const latestBlock = await alchemy.core.getBlockNumber();
    console.log("The latest block number is", latestBlock);
  } catch (error) {
    console.error("Error fetching block number:", error);
  }
}

main();
