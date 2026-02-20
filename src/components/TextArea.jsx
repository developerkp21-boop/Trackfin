const TextArea = ({ label, helper, error, className = '', ...props }) => (
  <div className="mb-3">
    {label && <label className="form-label fw-medium text-app-secondary small">{label}</label>}
    <textarea
      className={`form-control rounded-3 px-3 py-2 ${error ? 'is-invalid' : ''} ${className}`}
      rows={5}
      {...props}
    />
    {helper && !error && <div className="form-text text-app-muted small">{helper}</div>}
    {error && <div className="invalid-feedback d-block">{error}</div>}
  </div>
)

export default TextArea
