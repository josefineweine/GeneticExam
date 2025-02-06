import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { getDonorById } from '../../utils/contractUtils'
import './DonorProfile.css'

function DonorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [donor, setDonor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDonor = async () => {
      try {
        const donorData = await getDonorById(id)
        setDonor(donorData)
      } catch (error) {
        console.error('Error loading donor:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDonor()
  }, [id])

  const handleRequestUsage = async () => {
    try {
      const request = {
        id: Date.now(),
        donorId: donor.id,
        donorName: donor.name,
        requestDate: new Date().toISOString(),
        currentUsageCount: donor.usageCount,
        status: 'pending'
      }

      const pendingRequests = JSON.parse(localStorage.getItem('pendingApprovals') || '[]')
      pendingRequests.push(request)
      localStorage.setItem('pendingApprovals', JSON.stringify(pendingRequests))

      navigate('/dashboard', { 
        state: { message: 'Usage request submitted successfully' } 
      })
    } catch (error) {
      console.error('Error requesting usage:', error)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!donor) return <div className="error">Donor not found</div>

  return (
    <div className="donor-profile">
      <Link 
        to={location.state?.from === 'donorMatch' ? '/match' : '/donors'}
        className="back-link"
      >
        ← Back to {location.state?.from === 'donorMatch' ? 'Donor Matches' : 'Registered Donors'}
      </Link>

      <div className="profile-header">
        <h2>{donor.name}</h2>
        <span className={`status ${donor.usageCount < donor.maxUsage ? 'active' : 'inactive'}`}>
          {donor.usageCount < donor.maxUsage ? 'Active' : 'Inactive'}
        </span>
        <span className="donor-id">ID: {donor.id}</span>
      </div>

      <div className="profile-sections">
        <section className="profile-section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Age</label>
              <span>{calculateAge(donor.dateOfBirth)} years</span>
            </div>
            <div className="info-item">
              <label>Blood Type</label>
              <span>{donor.bloodType}</span>
            </div>
            <div className="info-item">
              <label>Ethnicity</label>
              <span>{donor.ethnicity}</span>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h3>Physical Characteristics</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Height</label>
              <span>{donor.height} cm</span>
            </div>
            <div className="info-item">
              <label>Weight</label>
              <span>{donor.weight} kg</span>
            </div>
            <div className="info-item">
              <label>Eye Color</label>
              <span>{donor.eyeColor}</span>
            </div>
            <div className="info-item">
              <label>Hair Color</label>
              <span>{donor.hairColor}</span>
            </div>
            <div className="info-item">
              <label>Skin Tone</label>
              <span>{donor.skinTone}</span>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h3>Health Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Smoking</label>
              <span>{donor.smoking ? 'Yes' : 'No'}</span>
            </div>
            <div className="info-item">
              <label>Alcohol</label>
              <span>{donor.alcohol ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h3>Medical History</h3>
          <div className="info-grid">
            <div className="info-item full-width">
              <label>Family History of Genetic Conditions</label>
              <span>{donor.geneticConditions}</span>
            </div>
            <div className="info-item full-width">
              <label>Chronic Diseases</label>
              <span>{donor.chronicDiseases}</span>
            </div>
            <div className="info-item full-width">
              <label>Allergies</label>
              <span>{donor.allergies}</span>
            </div>
            <div className="info-item full-width">
              <label>Vaccination History</label>
              <span>{donor.vaccinationHistory}</span>
            </div>
            <div className="info-item full-width">
              <label>Family Medical History</label>
              <span>{donor.familyDiseases}</span>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h3>Background & Interests</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Education</label>
              <span>{donor.education}</span>
            </div>
            <div className="info-item">
              <label>Occupation</label>
              <span>{donor.occupation}</span>
            </div>
            <div className="info-item full-width">
              <label>Interests & Hobbies</label>
              <span>{donor.interests}</span>
            </div>
          </div>
        </section>

        <section className="profile-section usage-section">
          <h3>Usage Information</h3>
          <div className="usage-stats">
            <div className="usage-stat">
              <label>Current Uses</label>
              <span>{donor.usageCount}</span>
            </div>
            <div className="usage-stat">
              <label>Maximum Uses</label>
              <span>{donor.maxUsage}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="profile-actions">
        {donor.usageCount < donor.maxUsage && (
          <button 
            className="request-usage-button"
            onClick={handleRequestUsage}
            disabled={!donor.isActive}
          >
            Request Usage
          </button>
        )}
      </div>
    </div>
  )
}

function calculateAge(dateOfBirth) {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

export default DonorProfile 