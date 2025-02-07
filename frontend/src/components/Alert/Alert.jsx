import './Alert.css'

function Alert({ type, message }) {
  return (
    <div className={`alert alert-${type}`}>
      {type === 'error' && <span className="alert-icon">⚠️</span>}
      {type === 'success' && <span className="alert-icon">✅</span>}
      {type === 'loading' && (
        <>
          <div className="loading-spinner" />
          <span>{message}</span>
        </>
      )}
      {type !== 'loading' && <p>{message}</p>}
    </div>
  )
}

export default Alert 