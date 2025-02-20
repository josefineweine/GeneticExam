import Web3 from 'web3';
import { CONTRACT_ABI } from '../contracts/contract';

let web3;
let contract;
let accounts;

const CONTRACT_ADDRESS = "0x2300DAaa57ec42a93AA5892619A59534d9021bf7";

export const initializeWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    accounts = await web3.eth.getAccounts();
  } else {
    throw new Error('Please install MetaMask!');
  }
};

export const connectWallet = async () => {
  try {
    await initializeWeb3();
    const userAccounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    accounts = userAccounts;
    localStorage.setItem('walletAddress', accounts[0]);
    setUpContract(accounts[0]);

    return { address: accounts[0] };
  } catch (error) {
    throw new Error('Failed to connect wallet: ' + error.message);
  }
};

const setUpContract = (address) => {
  if (!web3) throw new Error('Web3 is not initialized.');
  if (!Array.isArray(CONTRACT_ABI)) {
    console.error('Invalid ABI format:', CONTRACT_ABI); // 🛑 Debug Log
    throw new Error('Invalid ABI format.');
  }

  console.log('Initializing contract with ABI:', CONTRACT_ABI); // 🛑 Debug Log
  console.log('Contract Address:', CONTRACT_ADDRESS); // 🛑 Debug Log

  contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  accounts = [address];

  console.log('Contract instance:', contract); // 🛑 Debug Log
};


export const getContract = () => {
  if (!contract) throw new Error('Contract not initialized. Connect wallet first.');
  return contract;
};

export const getWalletAddress = () => {
  return localStorage.getItem('walletAddress');
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