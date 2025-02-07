

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { connectWallet, disconnectWallet } from '../../utils/contractUtils'
import Alert from '../Alert/Alert'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const [account, setAccount] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkWalletConnection = () => {
      const savedAddress = localStorage.getItem('walletAddress')
      if (savedAddress) {
        setAccount(savedAddress)
      } else {
        setAccount('')
      }
    }

    checkWalletConnection()

    window.addEventListener('storage', checkWalletConnection)
    window.addEventListener('walletChanged', checkWalletConnection)

    return () => {
      window.removeEventListener('storage', checkWalletConnection)
      window.removeEventListener('walletChanged', checkWalletConnection)
    }
  }, [])

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setError(null)
      const { address } = await connectWallet()
      setAccount(address)
      localStorage.setItem('walletAddress', address) // Store the address in localStorage
      window.dispatchEvent(new Event('walletChanged'))
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet() // Call the disconnectWallet function
      setAccount('')
      window.dispatchEvent(new Event('walletChanged'))
      navigate('/')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <header className="header">
      <Link to="/" className="logo">Genetic Exam</Link>
      <div className="header-right">
        {error && <Alert type="error" message={error} />}
        <div className="wallet-buttons">
          {account && (
            <button 
              className="disconnect-button"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          )}
          <button 
            className={`connect-button ${account ? 'connected' : ''}`}
            onClick={handleConnect}
            disabled={isConnecting || account}
          >
            {isConnecting ? (
              <Alert type="loading" message="Connecting..." />
            ) : account ? (
              account.slice(0, 6) + '...' + account.slice(-4)
            ) : (
              'Connect Wallet'
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
