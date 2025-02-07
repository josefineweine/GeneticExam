import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/DonorRegistry';

// Function to connect wallet
export const connectWallet = async () => {
  try {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const address = await signer.getAddress();
      console.log('Connected wallet address:', address);

      // Store wallet address in localStorage for persistence
      localStorage.setItem('walletAddress', address);

      return address; // Return the connected wallet address
    } else {
      console.error('Ethereum provider not detected.');
      return null;
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return null;
  }
};

// Function to disconnect wallet (clear localStorage)
export const disconnectWallet = () => {
  localStorage.removeItem('walletAddress'); // Remove wallet address from localStorage
  console.log('Wallet disconnected');
};

// Store donor data in the blockchain (smart contract)
export const storeDonorData = async (metadataCID) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    // Call registerDonor with metadataCID
    const transaction = await contract.registerDonor(metadataCID);
    await transaction.wait();

    return {
      success: true,
      metadataCID,
      transactionHash: transaction.hash,
    };
  } catch (error) {
    console.error('Error storing donor data:', error);
    return { success: false, error };
  }
};

// Fetch all donors from the smart contract
export const getDonors = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    const donorCount = await contract.donorCount();
    if (!donorCount || donorCount.toString() === "0") {
      console.warn("No donors found.");
      return []; // Return empty array if no donors exist
    }

    const donors = [];
    
    for (let i = 1; i <= donorCount; i++) {
      const donor = await contract.donors(i);
      donors.push({
        id: donor.id.toString(),
        metadataCID: donor.metadataCID, // Storing metadataCID
        isActive: donor.isActive,
        usageCount: donor.usageCount.toString(),
        maxUsage: donor.maxUsage.toString(),
      });
    }

    return donors;
  } catch (error) {
    console.error('Error fetching donors:', error);
    throw error;
  }
};
