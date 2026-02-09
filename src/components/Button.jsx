const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand-soft disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary:
    'bg-button-primary text-button-text shadow-soft hover:bg-button-hover focus:ring-accent-soft',
  secondary:
    'bg-brand-600 text-on-brand hover:bg-brand-700 focus:ring-brand-soft',
  outline:
    'border border-border-subtle bg-bg-card text-text-secondary hover:border-accent-strong hover:text-text-primary dark:border-border-strong dark:bg-bg-card/80 dark:text-text-secondary',
  ghost:
    'bg-transparent text-text-secondary hover:bg-bg-secondary/60 dark:text-text-secondary dark:hover:bg-bg-secondary/30',
  danger:
    'bg-state-danger text-on-accent hover:bg-state-danger/90 focus:ring-accent-soft',
  success:
    'bg-state-success text-on-brand hover:bg-state-success/90 focus:ring-brand-soft'
}

const Button = ({ variant = 'primary', className = '', ...props }) => (
  <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props} />
)

export default Button
