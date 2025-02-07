import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchDonors } from '../../utils/interact'; // Use interact.js for fetching data
import './DonorMatch.css';

function DonorMatch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState(() => {
    const saved = localStorage.getItem('donorMatchCriteria');
    return saved ? JSON.parse(saved) : {
      bloodType: '',
      ethnicity: '',
      minAge: '',
      maxAge: '',
      eyeColor: '',
      hairColor: ''
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
      bloodType: '',
      ethnicity: '',
      minAge: '',
      maxAge: '',
      eyeColor: '',
      hairColor: ''
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
      const allDonors = await fetchDonors(); // Fetch donors from the smart contract
      const filtered = allDonors.filter(donor => {
        const age = calculateAge(donor.dateOfBirth);
        return (
          (!searchCriteria.bloodType || donor.bloodType === searchCriteria.bloodType) &&
          (!searchCriteria.ethnicity || donor.ethnicity === searchCriteria.ethnicity) &&
          (!searchCriteria.minAge || age >= parseInt(searchCriteria.minAge)) &&
          (!searchCriteria.maxAge || age <= parseInt(searchCriteria.maxAge)) &&
          (!searchCriteria.eyeColor || donor.eyeColor === searchCriteria.eyeColor) &&
          (!searchCriteria.hairColor || donor.hairColor === searchCriteria.hairColor)
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
      <Link to="/dashboard" className="back-link">
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
        {/* ... Form Fields (Blood Type, Ethnicity, Age, etc.) */}
        {/* Similar to the existing code */}
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
