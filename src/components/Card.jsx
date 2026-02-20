const Card = ({ className = '', children, ...props }) => (
  <div className={`glass-card rounded-4 p-4 ${className}`} {...props}>
    {children}
  </div>
)

export default Card
