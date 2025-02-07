require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { API_URL, PRIVATE_KEY } = process.env;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: "0.8.0", 
  defaultNetwork: "localhost",  
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545", 
      accounts: [`0x${PRIVATE_KEY}`] 
    },
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
