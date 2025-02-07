
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/DonorRegistry';  // Adjust the path as needed

let provider;
let contract;
let signer;

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer); // Use imported contract address and ABI

      const address = await signer.getAddress();
      return { address, status: 'Connected' };
    } catch (error) {
      return { address: '', status: 'Connection failed' };
    }
  } else {
    return { address: '', status: 'Please install MetaMask' };
  }
};

export const fetchDonors = async () => {
  try {
    const donorCount = await contract.donorCount();  
    const donorList = [];

    for (let i = 1; i <= donorCount; i++) {
      const donor = await contract.donors(i);  
      donorList.push(donor.metadataCID);  
    }

    return donorList;
  } catch (error) {
    console.error('Error fetching donors:', error);
    return [];
  }
};

export const registerDonor = async (walletAddress, donorMetadataCID) => {
  try {
    const tx = await contract.registerDonor(donorMetadataCID);  // Call registerDonor function in your contract
    await tx.wait();
    return `Donor registered with CID: ${donorMetadataCID}`;
  } catch (error) {
    console.error('Error registering donor:', error);
    throw new Error('Registration failed');
  }
};
