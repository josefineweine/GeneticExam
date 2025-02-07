import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDonors } from '../../utils/interact'; // Use interact.js for fetching data
import './DonorList.css';

function DonorList() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [successfulMatches, setSuccessfulMatches] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the donors and successful matches
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching data
      try {
        const donorList = await fetchDonors(); // Fetch donors from smart contract
        console.log(donorList); // Log the response to check its structure
        if (Array.isArray(donorList)) {
          setDonors(donorList); // Set donors if it's an array
        } else {
          console.error('Donor data is not an array:', donorList);
          setDonors([]);  // Set donors to empty array if it's not an array
        }

        const matches = JSON.parse(localStorage.getItem('successfulMatches') || '[]');
        setSuccessfulMatches(matches);
      } catch (error) {
        console.error('Error fetching donor data:', error);
        setDonors([]); // Reset to empty array in case of an error
      }
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchData();
  }, []);

  // Check if a donor has a match
  const isMatched = (donorId) => {
    return successfulMatches.some(match => match.donorId === donorId);
  };

  const getDonorUsageCount = (donorId) => {
    return successfulMatches.filter(match => match.donorId === donorId).length;
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  return (
    <div className="donor-list">
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <h2>Registered Donors</h2>

      <div className="donors-grid">
        {Array.isArray(donors) && donors.length > 0 ? (
          donors.map(donor => {
            const usageCount = getDonorUsageCount(donor.id);
            const isMaxedOut = usageCount >= 3;

            return (
              <div key={donor.id} className={`donor-card ${isMaxedOut ? 'maxed-out' : ''}`}>
                <div className="donor-info">
                  <h4>Donor #{donor.id}</h4>
                  <p>Metadata CID: {donor.metadataCID}</p> {/* Display metadata CID */}
                  <p>Is Active: {donor.isActive ? 'Yes' : 'No'}</p>
                  
                  {/* Display usage status */}
                  <div className={`usage-badge ${isMaxedOut ? 'max-reached' : ''}`}>
                    <p>Uses: {usageCount}/3</p>
                    {isMaxedOut && <p>Maximum usage reached</p>}
                  </div>
                </div>

                <button 
                  className="view-profile-button"
                  onClick={() => navigate(`/donor/${donor.id}`)}
                >
                  View Profile
                </button>
              </div>
            );
          })
        ) : (
          <p>No donors found.</p> // Fallback if no donors available
        )}
      </div>
    </div>
  );
}

export default DonorList;
