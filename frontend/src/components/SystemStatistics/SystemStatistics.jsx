import { useState, useEffect } from 'react'
import { getDonors, approveDonorUsage, getTotalSuccessfulMatches } from '../../utils/contractUtils'
import { getSuccessfulMatches, updateSuccessfulMatches } from '../../utils/mockStorage'
import './SystemStatistics.css'

function SystemStatistics() {
  const [stats, setStats] = useState({
    activeDonors: 0,
    successfulMatches: 0
  })
  const [pendingRequests, setPendingRequests] = useState([])
  const [successfulMatches, setSuccessfulMatches] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [processingRequestId, setProcessingRequestId] = useState(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const donors = await getDonors()
        const activeDonors = donors.filter(donor => donor.isActive).length
        const requests = JSON.parse(localStorage.getItem('pendingApprovals') || '[]')
        const matches = await getTotalSuccessfulMatches()
        
        setStats({
          activeDonors,
          successfulMatches: matches
        })
        setPendingRequests(requests)
      } catch (error) {
        console.error('Error loading system statistics:', error)
      }
    }

    loadStats()
  }, [])

  useEffect(() => {
    setSuccessfulMatches(getSuccessfulMatches())
  }, [])

  const handleApprove = async (request) => {
    try {
      setIsLoading(true)
      setProcessingRequestId(request.id)

      await approveDonorUsage(request.donorId)

      const updatedRequests = pendingRequests.filter(r => r.id !== request.id)
      localStorage.setItem('pendingApprovals', JSON.stringify(updatedRequests))
      setPendingRequests(updatedRequests)

      const matches = await getTotalSuccessfulMatches()
      setStats(prev => ({
        ...prev,
        successfulMatches: matches
      }))

      alert('Request approved successfully!')
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Failed to approve request. Please check your wallet and try again.')
    } finally {
      setIsLoading(false)
      setProcessingRequestId(null)
    }
  }

  const handleReject = (requestId) => {
    const updatedRequests = pendingRequests.filter(request => request.id !== requestId)
    localStorage.setItem('pendingApprovals', JSON.stringify(updatedRequests))
    setPendingRequests(updatedRequests)
  }

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
                  <p>Donor: {request.donorName}</p>
                  <p>Current Usage: {request.currentUsageCount}</p>
                  <p>Requested: {new Date(request.requestDate).toLocaleDateString()}</p>
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
  )
}

export default SystemStatistics 