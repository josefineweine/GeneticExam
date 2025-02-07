import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config/DonorRegistry'; // Correct import

const Upload = () => {
  const [metadataCID, setMetadataCID] = useState('');
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    try {
      // Check if Ethereum is available (MetaMask or other wallet)
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Create contract instance using ABI and contract address
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        // Call the registerDonor function with the metadataCID
        const tx = await contract.registerDonor(metadataCID);
        setStatus('Transaction sent! Waiting for confirmation...');
        
        // Wait for the transaction to be mined
        await tx.wait();
        setStatus('Donor Registered Successfully!');
      } else {
        setStatus('Ethereum provider not found. Please install MetaMask.');
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={metadataCID} 
        onChange={(e) => setMetadataCID(e.target.value)} 
        placeholder="Enter Metadata CID"
      />
      <button onClick={handleUpload}>Upload</button>
      <p>{status}</p>
    </div>
  );
};

export default Upload;
