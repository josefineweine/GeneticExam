import { useNavigate } from 'react-router-dom'
import './About.css'


function About() {
  const navigate = useNavigate()
  
  return (
    <div className="about">
      <div className="about-container">
        <button 
          className="back-link"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>

        <section className="about-section">
          <h2>What is GeneVault?</h2>
          <p>GeneVault is a decentralized platform that leverages blockchain technology to securely store and manage sperm donation data, ensuring privacy, transparency, and compliance with ethical standards.</p>
        </section>
        
        <section className="about-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-content">
                <h3>Secure Storage</h3>
                <p>Secure storage of genetic data on the blockchain</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-content">
                <h3>Full Control</h3>
                <p>Full control over your genetic information</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-content">
                <h3>Transparent Access</h3>
                <p>Transparent access management</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-content">
                <h3>Decentralized</h3>
                <p>Decentralized architecture</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <h2>How It Works</h2>
          <p>Your genetic data is encrypted and securely stored on the blockchain, giving you full control over access through smart contracts, ensuring your privacy and security at all times.</p>
        </section>
      </div>
    </div>
  )
}

export default About 