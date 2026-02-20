const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="d-flex flex-column align-items-center justify-content-center gap-2 rounded-4 border border-dashed border-app-subtle bg-body-tertiary px-4 py-4 text-app-secondary">
    <div className="spinner-border text-success" role="status" aria-hidden="true" />
    <p className="small fw-medium mb-0">{label}</p>
  </div>
)

export default LoadingSpinner
