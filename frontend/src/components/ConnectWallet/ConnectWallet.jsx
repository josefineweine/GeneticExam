import { useState, useEffect } from 'react';
import Web3 from 'web3'; 

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNetwork = async () => {
    if (window.ethereum && account) {
      try {
        const web3 = new Web3(window.ethereum); 
        const networkId = await web3.eth.net.getId();
        setNetwork(networkId);

        // Fetch the network name (optional, for a better UX)
        const networkName = await web3.eth.net.getNetworkType();
        setNetworkName(networkName);
      } catch (error) {
        console.error('Error fetching network:', error);
      }
    }
  };

  useEffect(() => {
    // On initial load, check if the wallet is already connected
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setAccount(storedAddress);
      fetchNetwork(); 
    }

    if (window.ethereum) {
      // Listen for chain changes (when the user switches networks)
      window.ethereum.on('chainChanged', fetchNetwork); 
    }

    return () => {
      if (window.ethereum) {
        // Cleanup event listener on unmount
        window.ethereum.removeListener('chainChanged', fetchNetwork); 
      }
    };
  }, []); // Empty dependency array ensures this only runs on mount

  const handleConnect = async () => {
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setAccount(address);
      localStorage.setItem('walletAddress', address);
      await fetchNetwork();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setNetwork(null);
    setNetworkName('');
    localStorage.removeItem('walletAddress');
  };

  return (
    <div className="connect-wallet">
      {loading && <p>Loading...</p>}

      {account ? (
        <div>
          <p>Connected: {account}</p>
          <p>Network: {networkName ? `${networkName} (${network})` : 'N/A'}</p>
          <button className="disconnect-button" onClick={handleDisconnect}>Disconnect</button>
        </div>
      ) : (
        <div>
          <button onClick={handleConnect}>Connect Wallet</button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
