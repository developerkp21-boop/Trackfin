const baseClasses =
  'd-inline-flex align-items-center justify-content-center gap-2 rounded-3 px-3 py-2 btn text-nowrap transition-smooth'

const variants = {
  primary: 'btn-primary text-dark shadow-sm',
  secondary: 'btn-secondary text-white',
  outline: 'btn-outline-secondary',
  ghost: 'btn-link text-secondary text-decoration-none',
  danger: 'btn-danger text-white',
  success: 'btn-success text-white'
}

const Button = ({ variant = 'primary', className = '', ...props }) => (
  <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props} />
)

export default Button
