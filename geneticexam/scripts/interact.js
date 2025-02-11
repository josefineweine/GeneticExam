const { ethers } = require("hardhat");
require("dotenv").config();
const { Network, Alchemy } = require("alchemy-sdk");

// ✅ Import ABI from JSON file in `src/config`
const fs = require("fs");
const path = require("path");
const contractABI = require(path.join(__dirname, "../frontend/src/config/contract-abi.json"));

// ✅ Define contract address from your config
const donorRegistryAddress = "0x2300DAaa57ec42a93AA5892619A59534d9021bf7";

// ✅ Set up Alchemy API key and network
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

async function main() {
  console.log("🚀 Starting script...");

  // ✅ Get signer (Required to send transactions)
  const [signer] = await ethers.getSigners();
  console.log(`🟢 Using signer: ${signer.address}`);

  // ✅ Get contract instance using imported ABI
  const DonorRegistry = new ethers.Contract(donorRegistryAddress, contractABI, signer);

  console.log("🟢 Contract instance retrieved successfully!");

  // ✅ Register a new donor
  const metadataCID = "QmQmpXJBCos24nPQ9FtPoiqFAFNSswuqRaP5yNfE2AMUdg";  
  const maxUsage = 5;

  console.log(`📌 Registering donor with metadata CID: ${metadataCID} and max usage: ${maxUsage}`);

  try {
    const tx = await DonorRegistry.registerDonor(metadataCID, maxUsage);
    await tx.wait();  // Wait for the transaction to be mined
    console.log(`✅ Donor registered successfully. Transaction hash: ${tx.hash}`);
  } catch (error) {
    console.error("❌ Error registering donor:", error);
  }

  // ✅ Fetch and print updated donor count
  try {
    const donorCount = await DonorRegistry.donorCount();
    console.log("🟢 Total donors registered:", donorCount.toString());
  } catch (error) {
    console.error("❌ Error fetching donor count:", error);
  }
}

// ✅ Run the script and handle errors
main().catch((error) => {
  console.error("❌ Script Error:", error);
  process.exit(1);
});
