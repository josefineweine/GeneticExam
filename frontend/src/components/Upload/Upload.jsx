import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../common/Alert';
import Web3 from 'web3';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../contracts/contract';  

const Upload = () => {
  const [formData, setFormData] = useState({
    metadataCID: '',
    maxUsage: 0,
    interests: '',
    dataConsent: false,
    termsAccepted: false,
    identityVerified: false,
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNext = () => {
    setErrors({});
    setCurrentStep((prev) => prev + 1);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.metadataCID) formErrors.metadataCID = 'Metadata CID is required';
    if (formData.maxUsage <= 0) formErrors.maxUsage = 'Max usage must be greater than zero';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; 

    setIsSubmitting(true);
    setError(null);

    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable(); 

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      const tx = await contract.methods.registerDonor(formData.metadataCID, formData.maxUsage).send({ from: account });

      await tx.transactionHash;

      navigate('/success');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-form">
        <form onSubmit={handleSubmit}>
          {/* Metadata CID Input */}
          <div className="form-step">
            <label htmlFor="metadataCID">Metadata CID</label>
            <input
              type="text"
              id="metadataCID"
              name="metadataCID"
              value={formData.metadataCID}
              onChange={handleInputChange}
              placeholder="Enter the metadata CID (e.g., IPFS hash)"
              className={errors.metadataCID ? 'error' : ''}
              required
            />
            {errors.metadataCID && <div className="error-message">{errors.metadataCID}</div>}
          </div>

          {/* Max Usage Input */}
          <div className="form-step">
            <label htmlFor="maxUsage">Max Usage</label>
            <input
              type="number"
              id="maxUsage"
              name="maxUsage"
              value={formData.maxUsage}
              onChange={handleInputChange}
              placeholder="Set the maximum usage"
              className={errors.maxUsage ? 'error' : ''}
              required
            />
            {errors.maxUsage && <div className="error-message">{errors.maxUsage}</div>}
          </div>

          {/* Interests Input (appears at the 4th step) */}
          {currentStep === 4 && (
            <div className="form-step">
              <label htmlFor="interests">Interests & Hobbies</label>
              <textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                placeholder="Share your interests, hobbies, and activities..."
                className={errors.interests ? 'error' : ''}
                required
              />
              {errors.interests && <div className="error-message">{errors.interests}</div>}
            </div>
          )}

          {/* Verification & Consent Section (appears at the 5th step) */}
          {currentStep === 5 && (
            <div className="form-step">
              <h3>Verification & Consent</h3>
              <p className="form-notice">Please review and confirm your understanding of the following:</p>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="data-consent"
                  name="dataConsent"
                  checked={formData.dataConsent || false}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="data-consent">
                  I consent to the anonymized storage and processing of my data
                </label>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="terms"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="terms">
                  I accept the terms, conditions, and ethical guidelines
                </label>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="identity"
                  name="identityVerified"
                  checked={formData.identityVerified}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="identity">
                  I confirm all provided information is accurate and verifiable
                </label>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="button-group">
            {currentStep > 1 && (
              <button
                type="button"
                className="back-button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                Back
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                className="next-button"
                onClick={handleNext}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading-text">
                    <span className="spinner"></span>
                    Registering donor...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </form>

        {/* New "Back to Dashboard" Button */}
        <button 
          type="button"
          className="back-dashboard-button"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>

        {error && <Alert type="error" message={error} />}
      </div>
    </div>
  );
};

export default Upload;
