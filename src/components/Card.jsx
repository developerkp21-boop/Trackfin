const Card = ({ className = '', children }) => (
  <div className={`glass-card rounded-xl p-6 ${className}`}>{children}</div>
)

export default Card
