import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getDonorById } from '../../utils/contractUtils';

function DonorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDonor = async () => {
      try {
        const donorData = await getDonorById(id);
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
        status: 'pending'
      };

      const pendingRequests = JSON.parse(localStorage.getItem('pendingApprovals') || '[]');
      pendingRequests.push(request);
      localStorage.setItem('pendingApprovals', JSON.stringify(pendingRequests));

      navigate('/dashboard', {
        state: { message: 'Usage request submitted successfully' }
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
        <ProfileSection title="Personal Information">
          <InfoItem label="Age" value={`${calculateAge(donor.dateOfBirth)} years`} />
          <InfoItem label="Blood Type" value={donor.bloodType} />
          <InfoItem label="Ethnicity" value={donor.ethnicity} />
        </ProfileSection>

        <ProfileSection title="Physical Characteristics">
          <InfoItem label="Height" value={`${donor.height} cm`} />
          <InfoItem label="Weight" value={`${donor.weight} kg`} />
          <InfoItem label="Eye Color" value={donor.eyeColor} />
          <InfoItem label="Hair Color" value={donor.hairColor} />
          <InfoItem label="Skin Tone" value={donor.skinTone} />
        </ProfileSection>

        <ProfileSection title="Health Information">
          <InfoItem label="Smoking" value={donor.smoking ? 'Yes' : 'No'} />
          <InfoItem label="Alcohol" value={donor.alcohol ? 'Yes' : 'No'} />
        </ProfileSection>

        <ProfileSection title="Medical History">
          <FullWidthInfoItem label="Family History of Genetic Conditions" value={donor.geneticConditions} />
          <FullWidthInfoItem label="Chronic Diseases" value={donor.chronicDiseases} />
          <FullWidthInfoItem label="Allergies" value={donor.allergies} />
          <FullWidthInfoItem label="Vaccination History" value={donor.vaccinationHistory} />
          <FullWidthInfoItem label="Family Medical History" value={donor.familyDiseases} />
        </ProfileSection>

        <ProfileSection title="Background & Interests">
          <InfoItem label="Education" value={donor.education} />
          <InfoItem label="Occupation" value={donor.occupation} />
          <FullWidthInfoItem label="Interests & Hobbies" value={donor.interests} />
        </ProfileSection>

        <ProfileSection title="Usage Information">
          <UsageStats label="Current Uses" value={donor.usageCount} />
          <UsageStats label="Maximum Uses" value={donor.maxUsage} />
        </ProfileSection>
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

const ProfileSection = ({ title, children }) => (
  <section className="profile-section">
    <h3>{title}</h3>
    <div className="info-grid">{children}</div>
  </section>
);

const InfoItem = ({ label, value }) => (
  <div className="info-item">
    <label>{label}</label>
    <span>{value}</span>
  </div>
);

const FullWidthInfoItem = ({ label, value }) => (
  <div className="info-item full-width">
    <label>{label}</label>
    <span>{value}</span>
  </div>
);

const UsageStats = ({ label, value }) => (
  <div className="usage-stat">
    <label>{label}</label>
    <span>{value}</span>
  </div>
);

export default DonorProfile;
