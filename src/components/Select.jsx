const Select = ({ label, helper, error, className = '', children, ...props }) => (
  <div className="mb-3">
    {label && <label className="form-label fw-medium text-secondary small">{label}</label>}
    <select 
      className={`form-select rounded-3 px-3 py-2 ${error ? 'is-invalid' : ''} ${className}`} 
      {...props}
    >
      {children}
    </select>
    {helper && !error && <div className="form-text text-muted small">{helper}</div>}
    {error && <div className="invalid-feedback d-block">{error}</div>}
  </div>
)

export default Select
