import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import './SystemStatistics.css';

function SystemStatistics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeDonors: 0,
    successfulMatches: 0,
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingRequestId, setProcessingRequestId] = useState(null);

  // Assuming you have a contract ABI and address
  const contractAddress = '0xYourContractAddress';
  const contractABI = [
    // Add the ABI here for the necessary functions
    'function getDonors() public view returns (address[] memory, bool[] memory)',
    'function approveDonorUsage(address donorId) public',
    'function getTotalSuccessfulMatches() public view returns (uint256)',
    'function getPendingRequests() public view returns (address[] memory, uint256[] memory)', // Example method for pending requests
  ];

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Connect to the Ethereum provider (MetaMask, etc.)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Fetch donors from the smart contract
        const [donorAddresses, donorStatuses] = await contract.getDonors();
        const activeDonors = donorStatuses.filter(status => status).length;

        // Fetch pending requests (if available in the contract)
        const [requestAddresses, requestCounts] = await contract.getPendingRequests();
        const requests = requestAddresses.map((address, index) => ({
          id: index,
          donorId: address,
          currentUsageCount: requestCounts[index],
        }));

        // Fetch total successful matches from the contract
        const matches = await contract.getTotalSuccessfulMatches();

        setStats({
          activeDonors,
          successfulMatches: matches,
        });
        setPendingRequests(requests);
      } catch (error) {
        console.error('Error loading system statistics:', error);
      }
    };

    loadStats();
  }, []);

  const handleApprove = async (request) => {
    try {
      setIsLoading(true);
      setProcessingRequestId(request.id);

      // Connect to Ethereum provider and contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Approve donor usage
      await contract.approveDonorUsage(request.donorId);

      // Update the requests state and stats after approval
      const updatedRequests = pendingRequests.filter(r => r.id !== request.id);
      setPendingRequests(updatedRequests);

      // Re-fetch the total successful matches from the blockchain
      const matches = await contract.getTotalSuccessfulMatches();
      setStats(prev => ({
        ...prev,
        successfulMatches: matches,
      }));

      alert('Request approved successfully!');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please check your wallet and try again.');
    } finally {
      setIsLoading(false);
      setProcessingRequestId(null);
    }
  };

  const handleReject = (requestId) => {
    const updatedRequests = pendingRequests.filter(request => request.id !== requestId);
    setPendingRequests(updatedRequests);
  };

  return (
    <div className="system-statistics">
      <h2>System Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Donors</h3>
          <p className="stat-number">{stats.activeDonors}</p>
        </div>
        <div className="stat-card">
          <h3>Successful Matches</h3>
          <p className="stat-number">{stats.successfulMatches}</p>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div className="pending-requests">
          <h3>Pending Approval Requests</h3>
          <div className="requests-grid">
            {pendingRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-content">
                  <h4>Usage Request</h4>
                  <p>Donor: {request.donorId}</p>
                  <p>Current Usage: {request.currentUsageCount}</p>
                  <p>Requested: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="request-actions">
                  <button
                    className={`approve-button ${isLoading && processingRequestId === request.id ? 'loading' : ''}`}
                    onClick={() => handleApprove(request)}
                    disabled={isLoading}
                  >
                    {isLoading && processingRequestId === request.id ? (
                      <div className="loading-spinner"></div>
                    ) : 'Approve'}
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleReject(request.id)}
                    disabled={isLoading}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SystemStatistics;
