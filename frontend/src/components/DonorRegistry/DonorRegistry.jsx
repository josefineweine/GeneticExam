import { useState, useEffect } from 'react';
import { getDonors, registerDonor } from '../../utils/contractUtils'; // your contract interaction methods

const DonorRegistry = ({ walletAddress }) => {
  const [metadataCID, setMetadataCID] = useState('');
  const [maxUsage, setMaxUsage] = useState('');
  const [donors, setDonors] = useState([]);

  // Handle donor registration
  const handleRegisterDonor = async () => {
    try {
      const result = await registerDonor(metadataCID, maxUsage);
      alert(`Donor registered successfully. Donor ID: ${result.donorId}`);
      setMetadataCID('');
      setMaxUsage('');
      // Refresh the donor list after successful registration
      const donorList = await getDonors();
      setDonors(donorList);
    } catch (error) {
      console.error('Error registering donor:', error);
      alert('An error occurred while registering the donor.');
    }
  };

  // Fetch the donor list on initial load
  useEffect(() => {
    const loadDonors = async () => {
      try {
        const donorList = await getDonors();
        setDonors(donorList);
      } catch (error) {
        console.error('Error fetching donors:', error);
      }
    };
    loadDonors();
  }, []);

  return (
    <div>
      <h2>Donor Registry</h2>
      {!walletAddress ? (
        <p>Please connect your wallet to register a donor.</p>
      ) : (
        <>
          <h3>Register New Donor</h3>
          <input
            type="text"
            placeholder="Metadata CID"
            value={metadataCID}
            onChange={(e) => setMetadataCID(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Usage"
            value={maxUsage}
            onChange={(e) => setMaxUsage(e.target.value)}
          />
          <button onClick={handleRegisterDonor}>Register Donor</button>
        </>
      )}

      <div>
        <h3>Donor List</h3>
        {donors.length > 0 ? (
          donors.map((donor) => (
            <div key={donor.id}>
              <h4>{donor.name}</h4>
              {/* Render other donor details */}
              <p>Donor ID: {donor.id}</p>
              {/* Add more details if necessary */}
            </div>
          ))
        ) : (
          <p>No donors found.</p>
        )}
      </div>
    </div>
  );
};

export default DonorRegistry;
