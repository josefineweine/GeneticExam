import React, { useState, useEffect } from 'react';
import { connectWallet, getCurrentWalletConnected, fetchDonors, registerDonor } from '../utils/interact';

const DonorRegistry = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState('');
  const [donors, setDonors] = useState([]);
  const [donorData, setDonorData] = useState('');

  useEffect(() => {
    const loadWalletAndDonors = async () => {
      const { address } = await getCurrentWalletConnected();
      setWalletAddress(address);
      if (address) {
        setStatus('Wallet connected');
        const donorList = await fetchDonors();
        setDonors(donorList);
      }
    };
    loadWalletAndDonors();
  }, []);

  const handleConnectWallet = async () => {
    try {
      const { address, provider, network } = await connectWallet();
      setWalletAddress(address);
      setStatus('Connected to MetaMask');
      const donorList = await fetchDonors();
      setDonors(donorList);
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleRegisterDonor = async () => {
    try {
      setStatus('Registering donor...');
      const result = await registerDonor(walletAddress, donorData);  // Pass wallet address and metadata
      setStatus('Donor registered successfully!');
      console.log(result);
      const donorList = await fetchDonors(); // Refresh donors list
      setDonors(donorList);
    } catch (error) {
      setStatus('Error registering donor: ' + error.message);
    }
  };

  return (
    <div id="donorRegistryContainer">
      <button id="connectWalletButton" onClick={handleConnectWallet}>
        {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : 'Connect Wallet'}
      </button>
      <p>{status}</p>

      {walletAddress && (
        <div>
          <h2>Registered Donors:</h2>
          {donors.length > 0 ? (
            <ul>
              {donors.map((donor, index) => (
                <li key={index}>{donor}</li>
              ))}
            </ul>
          ) : (
            <p>No donors found.</p>
          )}

          <h2>Register a New Donor</h2>
          <input
            type="text"
            value={donorData}
            onChange={(e) => setDonorData(e.target.value)}
            placeholder="Enter donor metadata CID"
          />
          <button id="registerDonorButton" onClick={handleRegisterDonor}>
            Register Donor
          </button>
        </div>
      )}
    </div>
  );
};

export default DonorRegistry;
