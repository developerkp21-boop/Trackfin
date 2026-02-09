import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between">
    <p className="text-xs text-text-secondary">
      Page {page} of {totalPages}
    </p>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="px-3"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </Button>
      <Button
        variant="outline"
        className="px-3"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
)

export default Pagination
