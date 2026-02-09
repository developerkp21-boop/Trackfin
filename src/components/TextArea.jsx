const TextArea = ({ label, helper, error, className = '', ...props }) => (
  <label className="block space-y-2 text-sm text-ink-600 dark:text-ink-300">
    {label && <span className="font-medium">{label}</span>}
    <textarea className={`input-field min-h-[120px] ${className}`} {...props} />
    {helper && !error && <span className="text-xs text-ink-400">{helper}</span>}
    {error && <span className="text-xs text-blush-500">{error}</span>}
  </label>
)

export default TextArea
