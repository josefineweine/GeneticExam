import { getContract, getWalletAddress } from './web3';

export const getDonorById = async (donorId) => {
  try {
    const contractInstance = getContract();
    const donorData = await contractInstance.methods.getDonorById(donorId).call();
    return donorData;
  } catch (error) {
    console.error('Error fetching donor by ID:', error);
    throw error;
  }
};

export const updateSuccessfulMatches = async (donorId) => {
  try {
    const contractInstance = getContract();
    const sender = getWalletAddress();

    if (!sender) throw new Error("Wallet not connected");

    const tx = await contractInstance.methods.incrementDonorUsage(donorId).send({
      from: sender,
    });

    console.log('Successfully updated successful matches:', tx);
    return tx;
  } catch (error) {
    console.error('Error updating successful matches:', error);
    throw error;
  }
};

// Fetch all donors
export const getDonors = async () => {
  try {
    const contractInstance = getContract();
    const donorAddresses = await contractInstance.methods.getDonors().call(); 
    
    const donors = await Promise.all(donorAddresses.map(async (address) => {
      const metadataCID = await contractInstance.methods.getDonorMetadata(address).call(); 
      const usageCount = await contractInstance.methods.getDonorUsage(address).call(); 
      return { address, metadataCID, usageCount };
    }));

    return donors; 
  } catch (error) {
    console.error('Error fetching donors:', error);
    throw error;
  }
};

export const getTotalSuccessfulMatches = async () => {
  try {
    const contractInstance = getContract();
    const totalMatches = await contractInstance.methods.getTotalSuccessfulMatches().call();
    return totalMatches;
  } catch (error) {
    console.error('Error fetching total successful matches:', error);
    throw error;
  }
};
