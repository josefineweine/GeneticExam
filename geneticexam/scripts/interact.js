// scripts/interact.js
require("dotenv").config();
const { ethers } = require("ethers");

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const contract = require("../artifacts/contracts/DonorRegistry.sol/DonorRegistry.json");

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const donorRegistry = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
  try {
    console.log("Registering a new donor...");
    const metadataCID = "QmSomeIPFSHashForDonorDetails"; // Replace with actual CID
    const tx = await donorRegistry.registerDonor(metadataCID);
    await tx.wait();
    console.log("Donor registered successfully!");
  } catch (error) {
    console.error("Error registering donor:", error);
  }
}

main();
