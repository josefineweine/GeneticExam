const { ethers } = require("hardhat");

async function main() {
    // Get the contract factory
    const DonorRegistry = await ethers.getContractFactory("DonorRegistry");

    console.log("Deploying DonorRegistry contract...");
    
    // Deploy the contract
    const donorRegistry = await DonorRegistry.deploy();
    
    // Wait for deployment to be confirmed
    await donorRegistry.deployed();

    console.log(`DonorRegistry deployed to: ${donorRegistry.address}`);
}

// Run the deploy function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
