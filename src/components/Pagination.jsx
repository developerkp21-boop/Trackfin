import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
    <p className="small text-app-secondary mb-0">
      Page {page} of {totalPages}
    </p>
    <div className="d-flex align-items-center gap-2">
      <Button
        variant="outline"
        className="px-3"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} />
        Prev
      </Button>
      <Button
        variant="outline"
        className="px-3"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  </div>
)

export default Pagination
