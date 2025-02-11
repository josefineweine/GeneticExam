import { useState, useEffect } from 'react'
import { getDonors } from '../../utils/contractUtils'

function MatchingDonors() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetching donors with error handling
  useEffect(() => {
    const loadDonors = async () => {
      try {
        const donorList = await getDonors()
        const activeDonors = donorList.filter(donor => donor.isActive)
        setDonors(activeDonors)
      } catch (err) {
        console.error('Error fetching donors:', err)
        setError('Failed to load donors. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadDonors()
  }, [])

  if (loading) {
    return <div className="loading">Loading donors...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="matching-donors">
      <h2>Available Donors for Matching</h2>
      <div className="donor-grid">
        {donors.length === 0 ? (
          <p>No active donors available for matching.</p>
        ) : (
          donors.map((donor) => (
            <div key={donor.id} className="donor-card">
              <h3>Donor #{donor.id}</h3>
              <p>Blood Type: {donor.bloodType}</p>
              <p>Ethnicity: {donor.ethnicity}</p>
              <p>Education: {donor.education}</p>
              <p>Available Uses: {donor.maxUsage - donor.usageCount}</p>
              <button 
                className="match-button"
                disabled={donor.usageCount >= donor.maxUsage}
              >
                Request Match
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MatchingDonors
