import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDonors } from '../../utils/mockStorage';

function DonorList() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [successfulMatches, setSuccessfulMatches] = useState([]);

  useEffect(() => {
    const donorList = getDonors();  
    const matches = JSON.parse(localStorage.getItem('successfulMatches') || '[]');
    setDonors(donorList);
    setSuccessfulMatches(matches);
  }, []);

  const isMatched = (donorId) => successfulMatches.some(match => match.donorId === donorId);

  const getDonorUsageCount = (donorId) => {
    return successfulMatches.filter(match => match.donorId === donorId).length;
  };

  const isMaxedOut = (usageCount) => usageCount >= 3;

  return (
    <div className="donor-list">
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <h2>Registered Donors</h2>
      
      <div className="donors-grid">
        {donors.map(donor => {
          const usageCount = getDonorUsageCount(donor.id);
          const maxReached = isMaxedOut(usageCount);

          return (
            <div key={donor.id} className={`donor-card ${maxReached ? 'maxed-out' : ''}`}>
              <div className="donor-info">
                <h4>Donor #{donor.id}</h4>
                <p>Name: {donor.name}</p>
                <p>Blood Type: {donor.bloodType}</p>
                
                <div className={`usage-badge ${maxReached ? 'max-reached' : ''}`}>
                  <p>Uses: {usageCount}/3</p>
                  {maxReached && <p>Maximum usage reached</p>}
                </div>
              </div>
              
              <button 
                className="view-profile-button"
                onClick={() => navigate(`/donor/${donor.id}`)}
                disabled={maxReached}  
              >
                View Profile
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DonorList;
