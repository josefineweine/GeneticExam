require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: "0.8.0", 
  defaultNetwork: "hardhat", 
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.API_URL, // Use the Alchemy URL for Sepolia
      accounts: [`0x${process.env.PRIVATE_KEY}`]  // Use your private key
    }
  },
};
