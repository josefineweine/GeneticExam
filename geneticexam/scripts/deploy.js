const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const DonorRegistry = await ethers.getContractFactory("DonorRegistry");
  const donorRegistry = await DonorRegistry.deploy();
  console.log("DonorRegistry contract deployed to:", donorRegistry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
