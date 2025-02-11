import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import About from './components/About/About';
import Dashboard from './components/Dashboard/Dashboard';
import Upload from './components/Upload/Upload';
import ProtectedRoute from './components/common/ProtectedRoute';
import DonorProfile from './components/DonorProfile/DonorProfile';
import DonorMatch from './components/DonorMatch/DonorMatch';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <div className="app">
          <Header />
          <main className="main">
            <Routes>
              {/* Add the HeroAndAbout as the default (home) page */}
              <Route path="/" element={<About />} />

              {/* Other routes */}
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
              <Route path="/donor/:id" element={<ProtectedRoute><DonorProfile /></ProtectedRoute>} />
              <Route path="/match" element={<ProtectedRoute><DonorMatch /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
