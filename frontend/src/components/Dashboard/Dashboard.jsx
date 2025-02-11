import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { connectWallet } from '../../utils/web3';
import { getDonors, updateSuccessfulMatches } from '../../utils/contractUtils';
import Alert from '../common/Alert';

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [donors, setDonors] = useState([]);
  const [successfulMatches, setSuccessfulMatches] = useState([]);

  const showSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    const loadDonors = async () => {
      try {
        const donorsData = await getDonors();
        setDonors(donorsData);
      } catch (error) {
        console.error('Error fetching donors:', error);
      }
    };

    const loadPendingApprovals = () => {
      const storedApprovals = localStorage.getItem('pendingApprovals');
      if (storedApprovals) {
        setPendingApprovals(JSON.parse(storedApprovals));
      }
    };

    loadDonors();
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
      await updateSuccessfulMatches(approval.donorId);
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


    </div>
  );
}

export default Dashboard;
