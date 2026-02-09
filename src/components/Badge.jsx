const styles = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  danger: 'bg-blush-100 text-blush-700 dark:bg-blush-500/20 dark:text-blush-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200',
  neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-700/50 dark:text-ink-200'
}

const Badge = ({ variant = 'neutral', className = '', children }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]} ${className}`}
  >
    {children}
  </span>
)

export default Badge
