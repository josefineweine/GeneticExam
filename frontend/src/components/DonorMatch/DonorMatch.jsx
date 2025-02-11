import { useState, useEffect } from 'react';
import { getDonors } from '../../utils/contractUtils';
import { useNavigate, Link } from 'react-router-dom';

function DonorMatch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState(() => {
    const saved = localStorage.getItem('donorMatchCriteria');
    return saved ? JSON.parse(saved) : {
      ethnicity: '',
      location: '',
      bloodType: '',
      minAge: '',
      maxAge: '',
      eyeColor: '',
      hairColor: '',
      gender: '',
      donationHistory: '',
      healthStatus: '',
      rhFactor: ''
    };
  });

  const [matchedDonors, setMatchedDonors] = useState(() => {
    const saved = localStorage.getItem('donorMatchResults');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('donorMatchCriteria', JSON.stringify(searchCriteria));
    localStorage.setItem('donorMatchResults', JSON.stringify(matchedDonors));
  }, [searchCriteria, matchedDonors]);

  const handleReset = () => {
    setSearchCriteria({
      ethnicity: '',
      location: '',
      bloodType: '',
      minAge: '',
      maxAge: '',
      eyeColor: '',
      hairColor: '',
      gender: '',
      donationHistory: '',
      healthStatus: '',
      rhFactor: ''
    });
    setMatchedDonors([]);
    localStorage.removeItem('donorMatchCriteria');
    localStorage.removeItem('donorMatchResults');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const allDonors = await getDonors();
      const filtered = allDonors.filter(donor => {
        const age = calculateAge(donor.dateOfBirth);
        return (
          (!searchCriteria.ethnicity || donor.ethnicity === searchCriteria.ethnicity) &&
          (!searchCriteria.location || donor.location.toLowerCase().includes(searchCriteria.location.toLowerCase())) &&
          (!searchCriteria.bloodType || donor.bloodType === searchCriteria.bloodType) &&
          (!searchCriteria.minAge || age >= parseInt(searchCriteria.minAge)) &&
          (!searchCriteria.maxAge || age <= parseInt(searchCriteria.maxAge)) &&
          (!searchCriteria.eyeColor || donor.eyeColor === searchCriteria.eyeColor) &&
          (!searchCriteria.hairColor || donor.hairColor === searchCriteria.hairColor) &&
          (!searchCriteria.gender || donor.gender === searchCriteria.gender) &&
          (!searchCriteria.donationHistory || donor.donationHistory === searchCriteria.donationHistory) &&
          (!searchCriteria.healthStatus || donor.healthStatus === searchCriteria.healthStatus) &&
          (!searchCriteria.rhFactor || donor.rhFactor === searchCriteria.rhFactor)
        );
      });
      setMatchedDonors(filtered);
    } catch (error) {
      console.error('Error searching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donor-match">
      <Link 
        to="/dashboard" 
        className="back-link"
      >
        ← Back to Dashboard
      </Link>

      <div className="header-actions">
        <h2>Find Donor Match</h2>
        {(matchedDonors.length > 0 || Object.values(searchCriteria).some(v => v !== '')) && (
          <button onClick={handleReset} className="reset-button">
            Reset Search
          </button>
        )}
      </div>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label>Ethnicity</label>
          <select name="ethnicity" value={searchCriteria.ethnicity} onChange={handleInputChange}>
            <option value="">Any</option>
            <option value="caucasian">Caucasian</option>
            <option value="asian">Asian</option>
            <option value="african">African</option>
            <option value="hispanic">Hispanic</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={searchCriteria.location}
            onChange={handleInputChange}
            placeholder="Enter region or country"
          />
        </div>

        <div className="form-group">
          <label>Blood Type</label>
          <select name="bloodType" value={searchCriteria.bloodType} onChange={handleInputChange}>
            <option value="">Any</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="form-group">
          <label>Min Age</label>
          <input
            type="number"
            name="minAge"
            value={searchCriteria.minAge}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Max Age</label>
          <input
            type="number"
            name="maxAge"
            value={searchCriteria.maxAge}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Eye Color</label>
          <select name="eyeColor" value={searchCriteria.eyeColor} onChange={handleInputChange}>
            <option value="">Any</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="brown">Brown</option>
            <option value="hazel">Hazel</option>
          </select>
        </div>

        <div className="form-group">
          <label>Hair Color</label>
          <select name="hairColor" value={searchCriteria.hairColor} onChange={handleInputChange}>
            <option value="">Any</option>
            <option value="black">Black</option>
            <option value="brown">Brown</option>
            <option value="blonde">Blonde</option>
            <option value="red">Red</option>
          </select>
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={searchCriteria.gender} onChange={handleInputChange}>
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Donation History</label>
          <select name="donationHistory" value={searchCriteria.donationHistory} onChange={handleInputChange}>
            <option value="">Any</option>
            <option value="first-time">First Time</option>
            <option value="previous">Previous Donor</option>
            <option value="multiple">Multiple Donations</option>
          </select>
        </div>

        <div className="form-group">
          <label>Health Status</label>
          <select name="healthStatus" value={searchCriteria.healthStatus} onChange={handleInputChange}>
            <option value="">Any</option>
            <option value="cleared">Cleared</option>
            <option value="under-review">Under Review</option>
            <option value="not-approved">Not Approved</option>
          </select>
        </div>

        <div className="form-group">
          <label>Rh Factor</label>
          <select name="rhFactor" value={searchCriteria.rhFactor} onChange={handleInputChange}>
            <option value="">Any</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
          </select>
        </div>

        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Find Matches'}
        </button>
      </form>

      <div className="results-section">
        <h3>Matched Donors ({matchedDonors.length})</h3>
        {matchedDonors.map(donor => (
          <div key={donor.id} className="donor-card">
            <h4>{donor.name}</h4>
            <div className="donor-details">
              <p>Blood Type: {donor.bloodType}</p>
              <p>Ethnicity: {donor.ethnicity}</p>
              <p>Age: {calculateAge(donor.dateOfBirth)} years</p>
              <p>Eye Color: {donor.eyeColor}</p>
              <p>Hair Color: {donor.hairColor}</p>
            </div>
            <button onClick={() => navigate(`/donor/${donor.id}`, {
              state: { from: 'donorMatch' }
            })}>
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonorMatch;
