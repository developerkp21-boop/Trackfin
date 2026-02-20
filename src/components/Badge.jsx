const styles = {
  success: 'text-bg-success',
  danger: 'text-bg-danger',
  warning: 'text-bg-warning text-dark',
  info: 'text-bg-info text-dark',
  neutral: 'bg-secondary-subtle text-secondary'
}

const Badge = ({ variant = 'neutral', className = '', children }) => (
  <span className={`badge rounded-pill fw-semibold px-3 py-2 ${styles[variant]} ${className}`}>
    {children}
  </span>
)

export default Badge
