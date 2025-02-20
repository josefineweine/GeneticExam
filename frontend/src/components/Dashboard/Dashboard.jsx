import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getContract } from '../../contracts/contract'; // Import contract
import { connectWallet } from '../../utils/web3';
import Alert from '../common/Alert';

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [donors, setDonors] = useState([]);
  const [successfulMatches, setSuccessfulMatches] = useState([]);
  const [donorCount, setDonorCount] = useState(null); // New state for donor count

  const showSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const contract = await getContract();
        if (!contract) {
          console.error("Contract not loaded!");
          return;
        }

        // Fetch donor count from the contract
        const count = await contract.donorCount();
        setDonorCount(count.toString());

        // Fetch donor list from contract
        const donorsData = await contract.getDonors();
        const formattedDonors = donorsData.map(donor => ({
          id: donor.id.toString(),
          metadataCID: donor.metadataCID,
          usageCount: donor.usageCount.toString(),
          maxUsage: donor.maxUsage.toString(),
          isActive: donor.isActive,
          owner: donor.owner
        }));
        setDonors(formattedDonors);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
      }
    };

    const loadPendingApprovals = () => {
      const storedApprovals = localStorage.getItem('pendingApprovals');
      if (storedApprovals) {
        setPendingApprovals(JSON.parse(storedApprovals));
      }
    };

    loadBlockchainData();
    loadPendingApprovals();
  }, []);

  const isWalletConnected = localStorage.getItem('walletAddress');

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await connectWallet();
      window.dispatchEvent(new Event('walletChanged'));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleApprove = async (approval) => {
    try {
      const contract = await getContract();
      await contract.incrementDonorUsage(approval.donorId);
      console.log('Match successfully recorded on-chain!');

      const updatedMatches = [
        ...successfulMatches,
        {
          id: approval.id,
          donorId: approval.donorId,
          donorName: approval.donorName,
          matchDate: new Date().toISOString(),
          status: 'matched',
          usageCount: (approval.currentUsageCount || 0) + 1,
        },
      ];

      setSuccessfulMatches(updatedMatches);
      localStorage.setItem('successfulMatches', JSON.stringify(updatedMatches));

      const updatedApprovals = pendingApprovals.filter((a) => a.id !== approval.id);
      setPendingApprovals(updatedApprovals);
      localStorage.setItem('pendingApprovals', JSON.stringify(updatedApprovals));
    } catch (error) {
      console.error('Error approving match:', error);
    }
  };

  const handleReject = (approvalId) => {
    const updatedApprovals = pendingApprovals.filter((a) => a.id !== approvalId);
    localStorage.setItem('pendingApprovals', JSON.stringify(updatedApprovals));
    setPendingApprovals(updatedApprovals);
  };

  if (!isWalletConnected) {
    return (
      <div className="dashboard-container">
        <div className="connect-wallet-section">
          <h2>Connect Your Wallet</h2>
          {error && <Alert type="error" message={error} />}
          <button
            className="connect-button"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {showSuccess && <Alert type="success" message="Donor successfully registered!" />}
      <h2>Welcome to Donor site!</h2>

      {/* Display Donor Count from Smart Contract */}
      <h3> Total Registered Donors: {donorCount !== null ? donorCount : "Loading..."}</h3>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card" onClick={() => navigate('/upload?role=donor')}>
          <h3>Register A new Donor</h3>
        </div>
        <div className="action-card" onClick={() => navigate('/match')}>
          <h3>Find Your Donor Match</h3>
        </div>
        <div className="action-card" onClick={() => navigate('/donors')}>
          <h3>View All Donors</h3>
        </div>
      </div>

      {/* List of Donors */}
      <h2>Registered Donors</h2>
      {donors.length > 0 ? (
        <ul>
          {donors.map((donor) => (
            <li key={donor.id}>
              <strong>ID:</strong> {donor.id} | <strong>Owner:</strong> {donor.owner} |
              <strong>Usage:</strong> {donor.usageCount}/{donor.maxUsage} |
              <strong>Status:</strong> {donor.isActive ? "Active" : "Inactive"}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading donors...</p>
      )}
    </div>
  );
}

export default Dashboard;