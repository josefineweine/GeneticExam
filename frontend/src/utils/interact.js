// // frontend/src/utils/interact.js
// import { ethers } from 'ethers';
// import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/DonorRegistry';

// export const connectWallet = async () => {
//   if (window.ethereum) {
//     try {
//       const addressArray = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const address = await signer.getAddress();
//       return { address };
//     } catch (err) {
//       return { address: "", status: "Error: " + err.message };
//     }
//   } else {
//     return { address: "", status: "MetaMask not installed" };
//   }
// };

// export const fetchDonors = async () => {
//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
//     const donorCount = await contract.donorCount();
//     const donors = [];
//     for (let i = 1; i <= donorCount; i++) {
//       const donor = await contract.donors(i);
//       donors.push(donor);
//     }
//     return donors;
//   } catch (error) {
//     return `Error fetching donors: ${error.message}`;
//   }
// };

// export const registerDonor = async (address, metadataCID) => {
//   if (!window.ethereum || !address) {
//     return { status: "Connect your wallet first" };
//   }
//   if (!metadataCID.trim()) {
//     return { status: "Metadata CID is required" };
//   }
//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
//     const tx = await contract.registerDonor(metadataCID);
//     await tx.wait();
//     return { status: "Donor registered successfully" };
//   } catch (error) {
//     return { status: `Error: ${error.message}` };
//   }
// };

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
