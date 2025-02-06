import { useState, useEffect } from 'react'
import { getDonors } from '../../utils/contractUtils'
import './MatchingDonors.css'

function MatchingDonors() {
  const [donors, setDonors] = useState([])

  useEffect(() => {
    const loadDonors = async () => {
      const donorList = await getDonors()
      setDonors(donorList.filter(donor => donor.isActive))
    }
    loadDonors()
  }, [])

  return (
    <div className="matching-donors">
      <h2>Available Donors for Matching</h2>
      <div className="donor-grid">
        {donors.map((donor) => (
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
        ))}
      </div>
    </div>
  )
}

export default MatchingDonors 