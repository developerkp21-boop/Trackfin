import { FileText } from 'lucide-react'
import Button from './Button'

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border-subtle bg-bg-secondary px-6 py-12 text-center dark:border-border-strong dark:bg-bg-card">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
      <FileText className="h-6 w-6" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
    {actionLabel && (
      <Button variant="outline" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
)

export default EmptyState
