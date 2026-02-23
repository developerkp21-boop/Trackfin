const Input = ({ label, helper, error, className = '', wrapperClassName = 'mb-3', ...props }) => (
  <div className={wrapperClassName}>
    {label && <label className="form-label fw-medium text-secondary small">{label}</label>}
    <input 
      className={`form-control rounded-3 px-3 py-2 ${error ? 'is-invalid' : ''} ${className}`} 
      {...props} 
    />
    {helper && !error && <div className="form-text text-muted small">{helper}</div>}
    {error && <div className="invalid-feedback d-block">{error}</div>}
  </div>
)

export default Input
