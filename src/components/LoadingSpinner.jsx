const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border-subtle bg-bg-secondary px-6 py-8 text-text-secondary dark:border-border-strong dark:bg-bg-card">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
    <p className="text-sm font-medium">{label}</p>
  </div>
)

export default LoadingSpinner
