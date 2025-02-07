// src/pages/ConnectWallet.jsx

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

function ConnectWallet() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically check if a wallet is already connected
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          navigate('/dashboard');
        }
      }
    };
    checkWalletConnection();
  }, [navigate]);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        navigate('/dashboard');
      } else {
        alert('Please install MetaMask to connect your wallet');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div>
      <h2>Connect your Wallet</h2>
      <button onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
}

export default ConnectWallet;
