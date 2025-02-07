import { useNavigate } from 'react-router-dom';
import './About.css';

function About() {
  const navigate = useNavigate();

  // Handle navigating to connect wallet page
  const handleGetConnected = () => {
    navigate('/connect-wallet'); // Navigate to the "Connect Wallet" page
  };

  return (
    <div className="about">
      <div className="about-container">
        <h1>Welcome to the Genetic dApp</h1>
       

        <div className="get-connected">
          <button onClick={handleGetConnected}>
            Get Connected
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;
