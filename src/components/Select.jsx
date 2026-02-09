const Select = ({ label, helper, error, className = '', children, ...props }) => (
  <label className="block space-y-2 text-sm text-ink-600 dark:text-ink-300">
    {label && <span className="font-medium">{label}</span>}
    <select className={`input-field ${className}`} {...props}>
      {children}
    </select>
    {helper && !error && <span className="text-xs text-ink-400">{helper}</span>}
    {error && <span className="text-xs text-blush-500">{error}</span>}
  </label>
)

export default Select
