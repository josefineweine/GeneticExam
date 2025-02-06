import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FileArrowUp, CheckCircle } from '@phosphor-icons/react'
import Alert from '../common/Alert/Alert'
import './Upload.css'
import { storeDonorData } from '../../utils/mockStorage'
import { CONTRACT_ADDRESS } from '../../config/contract'
import { ethers } from 'ethers'
import { DonorRegistryABI } from '../../contracts/DonorRegistry.cjs'

function Upload() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const role = searchParams.get('role')
  
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    
    // Physical Characteristics
    height: '',
    weight: '',
    eyeColor: '',
    hairColor: '',
    skinTone: '',
    vision: '',
    ethnicity: '',
    bloodType: '',
    rhFactor: '',
    physicalActivityLevel: '',
    
    // Health Habits
    smoking: false,
    alcohol: false,
    medications: '',
    
    // Medical History
    medicalHistory: {
      geneticConditions: false,
      chronicDiseases: false,
      allergies: false,
      medications: false
    },
    allergyDetails: '',
    vaccinationHistory: '',
    familyDiseases: '',
    
    // Education & Background
    education: '',
    occupation: '',
    interests: '',
    familyHistory: '',
    
    // Genetic Data
    dataType: '',
    geneticFile: null,
    
    // Consent
    dataConsent: false,
    termsAccepted: false,
    identityVerified: false,
    
    // Other Fields
    ethnicityDetails: '',
    healthHabits: '',
    bodyType: '',
    physicalActivity: ''
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('medical.')) {
      const [_, field] = name.split('.')
      setFormData(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [field]: checked
        },
        [field]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        if (!formData.name) newErrors.name = 'Full name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        break;
      case 2:
        if (!formData.height) newErrors.height = 'Height is required';
        if (!formData.weight) newErrors.weight = 'Weight is required';
        if (!formData.eyeColor) newErrors.eyeColor = 'Eye color is required';
        if (!formData.hairColor) newErrors.hairColor = 'Hair color is required';
        if (!formData.ethnicity) newErrors.ethnicity = 'Ethnicity is required';
        break;
      case 3:
        if (!formData.geneticConditionsDetails) newErrors.geneticConditionsDetails = 'Please provide information about genetic conditions or write None';
        if (!formData.chronicDiseasesDetails) newErrors.chronicDiseasesDetails = 'Please provide information about chronic diseases or write None';
        if (!formData.allergyDetails) newErrors.allergyDetails = 'Please provide information about allergies or write None';
        if (!formData.vaccinationHistory) newErrors.vaccinationHistory = 'Vaccination history is required';
        if (!formData.familyDiseases) newErrors.familyDiseases = 'Family medical history is required';
        break;
      case 4:
        if (!formData.education) newErrors.education = 'Education level is required';
        if (!formData.occupation) newErrors.occupation = 'Occupation is required';
        if (!formData.interests) newErrors.interests = 'Interests are required';
        break;
      case 5:
        if (!formData.termsAccepted) newErrors.terms = 'You must accept the terms and conditions';
        if (!formData.identityVerified) newErrors.identity = 'You must verify your identity';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Uppdatera label rendering för att inkludera required asterisk
  const renderLabel = (htmlFor, text) => (
    <label htmlFor={htmlFor} className="required-field">
      {text}
    </label>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(5)) {
      try {
        setIsSubmitting(true);
        setError(null);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          DonorRegistryABI.abi,
          signer
        );

        // Convert values and prepare data
        const heightInCm = parseInt(formData.height) || 0;
        const weightInKg = parseInt(formData.weight) || 0;
        const bloodTypeWithRh = formData.bloodType + (formData.rhFactor || '');

        // Send all parameters to the contract with text fields instead of boolean values
        const tx = await contract.registerDonor(
          formData.name,
          formData.dateOfBirth,
          formData.email,
          formData.phone,
          bloodTypeWithRh,
          formData.ethnicity,
          formData.education,
          heightInCm,
          weightInKg,
          formData.eyeColor,
          formData.hairColor,
          formData.skinTone,
          formData.vision || '',
          formData.smoking,
          formData.alcohol,
          formData.medications,
          formData.allergyDetails,
          formData.vaccinationHistory,
          formData.familyDiseases,
          formData.occupation,
          formData.interests,
          formData.bodyType,
          formData.physicalActivity,
          formData.geneticConditionsDetails || 'None',
          formData.chronicDiseasesDetails || 'None',
          formData.allergyDetails || 'None'
        );

        await tx.wait();
        navigate('/dashboard?success=true');
      } catch (error) {
        console.error('Form data:', formData);
        setError('Failed to register donor: ' + error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <button className="back-link" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="upload-header">
          <h2>{role === 'donor' ? 'Sperm Donor Registration' : 'Recipient Registration'}</h2>
        </div>

        <form className="upload-form">
          {/* Step 1: Personal info */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Personal Information</h3>
              <p className="form-notice">All fields in this form are required</p>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  required
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={errors.dateOfBirth ? 'error' : ''}
                  required
                />
                {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
                <small className="form-help">Must be between 18-45 years old</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    required
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    required
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Physical Characteristics */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>Physical Characteristics</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodType">Blood Type</label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="rhFactor">RH Factor</label>
                  <select
                    id="rhFactor"
                    name="rhFactor"
                    value={formData.rhFactor}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select RH Factor</option>
                    <option value="+">Positive (+)</option>
                    <option value="-">Negative (-)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ethnicity">Ethnicity</label>
                <select
                  id="ethnicity"
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Ethnicity</option>
                  <option value="caucasian">Caucasian</option>
                  <option value="african">African</option>
                  <option value="asian">Asian</option>
                  <option value="hispanic">Hispanic</option>
                  <option value="middleEastern">Middle Eastern</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="height">Height (cm)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="eyeColor">Eye Color</label>
                <select
                  id="eyeColor"
                  name="eyeColor"
                  value={formData.eyeColor}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Eye Color</option>
                  <option value="brown">Brown</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="hazel">Hazel</option>
                  <option value="gray">Gray</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="hairColor">Hair Color</label>
                <select
                  id="hairColor"
                  name="hairColor"
                  value={formData.hairColor}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Hair Color</option>
                  <option value="black">Black</option>
                  <option value="brown">Brown</option>
                  <option value="blonde">Blonde</option>
                  <option value="red">Red</option>
                  <option value="gray">Gray</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="skinTone">Skin Tone</label>
                <select
                  id="skinTone"
                  name="skinTone"
                  value={formData.skinTone}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Skin Tone</option>
                  <option value="veryFair">Very Fair</option>
                  <option value="fair">Fair</option>
                  <option value="medium">Medium</option>
                  <option value="olive">Olive</option>
                  <option value="brown">Brown</option>
                  <option value="darkBrown">Dark Brown</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="bodyType">Body Type</label>
                <select
                  id="bodyType"
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Body Type</option>
                  <option value="ectomorph">Ectomorph (Lean/Slim)</option>
                  <option value="mesomorph">Mesomorph (Athletic/Muscular)</option>
                  <option value="endomorph">Endomorph (Broader/Solid)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="physicalActivity">Physical Activity Level</label>
                <select
                  id="physicalActivity"
                  name="physicalActivity"
                  value={formData.physicalActivity}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Activity Level</option>
                  <option value="sedentary">Sedentary (Little to no exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="veryActive">Very Active (Professional athlete/Physical job)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Medical History */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>Medical History</h3>
              
              <div className="form-group">
                <label htmlFor="geneticConditionsDetails">Family History of Genetic Conditions</label>
                <textarea
                  id="geneticConditionsDetails"
                  name="geneticConditionsDetails"
                  value={formData.geneticConditionsDetails || ''}
                  onChange={handleInputChange}
                  placeholder="Please describe any genetic conditions in your family history, or write 'None' if there are none..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="chronicDiseasesDetails">Chronic Diseases</label>
                <textarea
                  id="chronicDiseasesDetails"
                  name="chronicDiseasesDetails"
                  value={formData.chronicDiseasesDetails || ''}
                  onChange={handleInputChange}
                  placeholder="Please describe any chronic diseases, or write 'None' if there are none..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="allergyDetails">Allergies</label>
                <textarea
                  id="allergyDetails"
                  name="allergyDetails"
                  value={formData.allergyDetails || ''}
                  onChange={handleInputChange}
                  placeholder="Please list any allergies, or write 'None' if there are none..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="vaccinationHistory">Vaccination History</label>
                <textarea
                  id="vaccinationHistory"
                  name="vaccinationHistory"
                  value={formData.vaccinationHistory}
                  onChange={handleInputChange}
                  placeholder="List your vaccination history..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="familyDiseases">Family Medical History</label>
                <textarea
                  id="familyDiseases"
                  name="familyDiseases"
                  value={formData.familyDiseases}
                  onChange={handleInputChange}
                  placeholder="Describe any diseases that run in your family..."
                />
              </div>
            </div>
          )}

          {/* Steg 4: Education & Background */}
          {currentStep === 4 && (
            <div className="form-step">
              <h3>Background & Interests</h3>
              
              <div className="form-group">
                <label htmlFor="education">Education Level</label>
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className={errors.education ? 'error' : ''}
                  required
                >
                  <option value="">Select Education Level</option>
                  <option value="highSchool">High School</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
                {errors.education && <div className="error-message">{errors.education}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="occupation">Current Occupation</label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className={errors.occupation ? 'error' : ''}
                  required
                />
                {errors.occupation && <div className="error-message">{errors.occupation}</div>}
              </div>

              <div className="form-group">
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
            </div>
          )}

          {/* Step 5: Terms & Consent */}
          {currentStep === 5 && (
            <div className="form-step">
              <h3>Verification & Consent</h3>
              <p className="form-notice">Please review and confirm your understanding of the following</p>
              
              <div className="form-group">
                <div className="consent-box">
                  <div className="consent-section">
                    <h5>Data Privacy & Protection</h5>
                    <ul>
                      <li>Your personal data will be anonymized on the blockchain</li>
                      <li>Only non-identifiable metadata will be stored</li>
                      <li>All processing complies with GDPR requirements</li>
                      <li>You can request data modifications where technically feasible</li>
                    </ul>
                  </div>

                  <div className="consent-section">
                    <h5>Legal & Ethical Framework</h5>
                    <ul>
                      <li>Compliance with EU data protection regulations (GDPR)</li>
                      <li>Adherence to Markets in Crypto-Assets (MiCA) standards</li>
                      <li>Ethical guidelines for reproductive healthcare data</li>
                      <li>Smart contract restrictions prevent data misuse</li>
                    </ul>
                  </div>
                </div>

                <div className="consent-checkboxes">
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
              </div>
            </div>
          )}

          <div className="button-group">
            {currentStep > 1 && (
              <button
                type="button"
                className="back-button"
                onClick={() => setCurrentStep(prev => prev - 1)}
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
                onClick={handleSubmit}
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

        {error && <Alert type="error" message={error} />}
      </div>
    </div>
  )
}

export default Upload 