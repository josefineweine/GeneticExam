require("dotenv").config();
const { ethers } = require("ethers");

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/DonorRegistry.sol/DonorRegistry.json");

// Connect to the provider
const provider = new ethers.providers.JsonRpcProvider(API_URL);

// Create a wallet/signer using your private key
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Connect to the deployed contract
const donorRegistry = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
    try {
        console.log("Registering a new donor...");

        // Example metadataCID (replace this with your actual IPFS/Arweave CID)
        const metadataCID = "QmSomeIPFSHashForDonorDetails"; 

        // Call registerDonor with metadataCID
        const tx = await donorRegistry.registerDonor(metadataCID);
        await tx.wait();

        console.log("✅ Donor registered successfully!");

        // Fetch donor details (you need the donor's ID, e.g., 1)
        const donorId = 1; // Assuming first donor is at index 1
        const donor = await donorRegistry.donors(donorId);
        console.log("👤 Donor Details:", donor);

    } catch (error) {
        console.error("❌ Error interacting with the contract:", error);
    }
}

main();
