import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getDonors } from '../../utils/contractUtils'; // Import getDonors
import './DonorProfile.css';

function DonorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDonor = async () => {
      try {
        const donors = await getDonors(); // Fetch all donors
        const donorData = donors.find(donor => donor.id === id); // Find donor by id
        setDonor(donorData);
      } catch (error) {
        console.error('Error loading donor:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDonor();
  }, [id]);

  const handleRequestUsage = async () => {
    try {
      const request = {
        id: Date.now(),
        donorId: donor.id,
        donorName: donor.name,
        requestDate: new Date().toISOString(),
        currentUsageCount: donor.usageCount,
        status: 'pending',
      };

      const pendingRequests = JSON.parse(localStorage.getItem('pendingApprovals') || '[]');
      pendingRequests.push(request);
      localStorage.setItem('pendingApprovals', JSON.stringify(pendingRequests));

      navigate('/dashboard', { 
        state: { message: 'Usage request submitted successfully' },
      });
    } catch (error) {
      console.error('Error requesting usage:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!donor) return <div className="error">Donor not found</div>;

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
        {/* Sections with donor details */}
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
  );
}

function calculateAge(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export default DonorProfile;
