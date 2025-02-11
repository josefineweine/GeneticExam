import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isWalletConnected = localStorage.getItem('walletAddress'); 

  useEffect(() => {
    if (!isWalletConnected) {
      navigate('/');
    }
  }, [isWalletConnected, navigate]); 


  if (!isWalletConnected) {
    return null; 
  }

  return children;
};

export default ProtectedRoute;
