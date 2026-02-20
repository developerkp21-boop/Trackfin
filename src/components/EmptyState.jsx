import { FileText } from 'lucide-react'
import Button from './Button'

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="d-flex flex-column align-items-center justify-content-center gap-3 rounded-4 border border-dashed border-app-subtle bg-body-tertiary px-4 py-5 text-center">
    <div className="d-flex align-items-center justify-content-center rounded-3 bg-success-subtle text-success p-3">
      <FileText size={22} />
    </div>
    <div>
      <h3 className="h5 fw-semibold text-app-primary mb-1">{title}</h3>
      <p className="text-app-secondary mb-0">{description}</p>
    </div>
    {actionLabel && (
      <Button variant="outline" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
)

export default EmptyState
