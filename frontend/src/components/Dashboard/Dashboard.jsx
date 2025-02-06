import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UserPlus, MagnifyingGlass, CheckCircle } from '@phosphor-icons/react'
import { connectWallet } from '../../utils/web3'
import { getDonors } from '../../utils/contractUtils'
import Alert from '../common/Alert/Alert'
import SystemStatistics from '../SystemStatistics/SystemStatistics'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
  })
  const [stats, setStats] = useState({
    activeDonors: 0,
    successfulMatches: 0
  })
  const [donors, setDonors] = useState([])
  const [successfulMatches, setSuccessfulMatches] = useState([])
  const [pendingApprovals, setPendingApprovals] = useState([])
  
  // Add success state to show message after registration
  const showSuccess = searchParams.get('success') === 'true'
  
  useEffect(() => {
    const loadDonors = async () => {
      const donors = await getDonors();
      setDonors(donors);
    };
    
    loadDonors();
  }, []);

  // Check if wallet is connected
  const isWalletConnected = localStorage.getItem('walletAddress')

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setError(null)
      const { address } = await connectWallet()
      window.dispatchEvent(new Event('walletChanged'))
    } catch (error) {
      setError(error.message)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    navigate(`/upload?role=${selectedRole}`)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleApprove = (approval) => {
    // Add to successful matches
    const successfulMatches = JSON.parse(localStorage.getItem('successfulMatches') || '[]')
    successfulMatches.push({
      id: approval.id,
      donorId: approval.donorId,
      donorName: approval.donorName,
      matchDate: new Date().toISOString(),
      status: 'matched',
      usageCount: approval.currentUsageCount + 1
    })
    localStorage.setItem('successfulMatches', JSON.stringify(successfulMatches))

    // Remove from pending approvals
    const updatedApprovals = pendingApprovals.filter(a => a.id !== approval.id)
    localStorage.setItem('pendingApprovals', JSON.stringify(updatedApprovals))
    setPendingApprovals(updatedApprovals)

    // Update stats
    setStats(prev => ({
      ...prev,
      successfulMatches: prev.successfulMatches + 1
    }))
  }

  const handleReject = (approvalId) => {
    const updatedApprovals = pendingApprovals.filter(a => a.id !== approvalId)
    localStorage.setItem('pendingApprovals', JSON.stringify(updatedApprovals))
    setPendingApprovals(updatedApprovals)
  }

  // Display Connect Wallet view if not connected
  if (!isWalletConnected) {
    return (
      <div className="dashboard-container">
        <div className="connect-wallet-section">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to access the administrator dashboard</p>
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
    )
  }

  // Display admin dashboard if wallet is connected 
  return (
    <div className="dashboard-container">
      {showSuccess && (
        <Alert 
          type="success" 
          message="Donor successfully registered!" 
        />
      )}
      <h2>Welcome to the Administrator Dashboard</h2>
      <p className="dashboard-description">
        Select an action to proceed with donor management
      </p>

      <div className="action-cards">
        <div className="action-card" onClick={() => handleRoleSelect('donor')}>
          <div className="card-icon">
            <UserPlus size={32} weight="light" />
          </div>
          <h3>Register New Donor</h3>
          <p>Upload new sperm donor information and genetic data</p>
          <ul>
            <li>Enter donor personal information</li>
            <li>Upload medical history</li>
            <li>Process genetic data</li>
          </ul>
        </div>

        <div className="action-card" onClick={() => navigate('/donors')}>
          <div className="card-icon">
            <MagnifyingGlass size={32} weight="light" />
          </div>
          <h3>View Donors</h3> 
          <p>Browse and manage registered donors</p>
          <ul>
            <li>View all registered donors</li>
            <li>Search donor database</li>
            <li>Access detailed profiles</li>
          </ul>
        </div>

        <div className="action-card" onClick={() => navigate('/match')}>
          <div className="card-icon">
            <MagnifyingGlass size={32} weight="light" />
          </div>
          <h3>Find Donor Match</h3> 
          <p>Search and match donors for recipients</p>
          <ul>
            <li>Search by criteria</li>
            <li>Compare donor profiles</li>
            <li>Process matching requests</li>
          </ul>
        </div>
      </div>

      {/* Successful Matches Section */}
      {successfulMatches.length > 0 && (
        <div className="successful-matches-section">
          <h3>Successful Matches</h3>
          <div className="donor-grid">
            {successfulMatches.map(donor => (
              <div key={donor.id} className="donor-card">
                <h4>{donor.name}</h4>
                <p>Age: {donor.age}</p>
                <div className="match-status">
                  <CheckCircle size={24} weight="fill" />
                  Matched Successfully
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Approvals Section */}
      {pendingApprovals.length > 0 && (
        <div className="pending-approvals-section">
          <h3>Pending Approvals</h3>
          <div className="approvals-grid">
            {pendingApprovals.map(approval => (
              <div key={approval.id} className="approval-card">
                <h4>Donor Request</h4>
                <p>Donor: {approval.donorName}</p>
                <p>Requested: {new Date(approval.requestDate).toLocaleDateString()}</p>
                <p>Current Usage: {approval.currentUsageCount}/3</p>
                <div className="approval-actions">
                  <button 
                    className="approve-button"
                    onClick={() => handleApprove(approval)}
                  >
                    Approve
                  </button>
                  <button 
                    className="reject-button"
                    onClick={() => handleReject(approval.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SystemStatistics />
    </div>
  )
}

export default Dashboard 