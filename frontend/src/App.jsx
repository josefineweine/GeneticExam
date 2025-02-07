import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import About from './components/About/About';
import Dashboard from './components/Dashboard/Dashboard';
import Upload from './components/Upload/Upload';
import DonorProfile from './components/DonorProfile/DonorProfile';
import DonorList from './components/DonorList/DonorList';
import DonorMatch from './components/DonorMatch/DonorMatch';
import DonorRegistry from './components/DonorRegistry/DonorRegistry';
import MatchingDonor from './components/MatchingDonor/MatchingDonor';
import SystemStatistics from './components/SystemStatistics/SystemStatistics';
import ConnectWallet from './components/ConnectWallet/ConnectWallet';

import './App.css';

function App() {
  return (
    <>
      <Router>
        <div className="app">
          <Header />
          <main className="main">
            <Routes>
              {/* Home page (About page) */}
              <Route path="/" element={<About />} />
              {}
              <Route path="/connect-wallet" element={<ConnectWallet />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/donors" element={<DonorList />} />
              <Route path="/donor/:id" element={<DonorProfile />} />
              <Route path="/match" element={<DonorMatch />} />
              <Route path="/donor-registry" element={<DonorRegistry />} />
              <Route path="/matching-donor" element={<MatchingDonor />} />
              <Route path="/system-statistics" element={<SystemStatistics />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
