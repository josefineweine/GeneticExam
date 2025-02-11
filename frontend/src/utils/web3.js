import Web3 from 'web3';
import { CONTRACT_ABI } from '../contracts/contract'; 

let web3;
let contract;
let accounts;

const CONTRACT_ADDRESS = "0x2300DAaa57ec42a93AA5892619A59534d9021bf7";

export const connectWallet = async () => {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);

      const userAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      accounts = userAccounts;
      const address = accounts[0];

      setUpContract(address);

      localStorage.setItem('walletAddress', address);
      return { address };
    } else {
      throw new Error('Please install MetaMask!');
    }
  } catch (error) {
    throw new Error('Failed to connect wallet: ' + error.message);
  }
};

export const disconnectWallet = async () => {
  try {
    localStorage.removeItem('walletAddress');  
    web3 = null;  // Clear Web3 instance
    contract = null;  // Clear contract instance
    accounts = []; // Clear accounts
  } catch (error) {
    throw new Error('Failed to disconnect wallet: ' + error.message);
  }
};

const setUpContract = (address) => {
  if (!web3) {
    throw new Error('Web3 is not initialized.');
  }

  if (!Array.isArray(CONTRACT_ABI)) {
    throw new Error('ABI is not in the correct format. Check abi-contract.json.');
  }

  contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  accounts = [address]; 
};

export const getContract = () => {
  if (!contract) {
    throw new Error('Contract is not initialized. Make sure the wallet is connected first.');
  }
  return contract;
};

export const getWalletAddress = () => {
  return localStorage.getItem('walletAddress');
};
