import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  // Logic to show a window of pages (e.g., 1, 2, 3, ..., 10)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Show max 5 buttons at a time

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="d-flex align-items-center justify-content-between p-3 border-top bg-white rounded-bottom-3 flex-wrap gap-2">
      <div className="small text-muted">
        Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
        <strong>{Math.min(currentPage * itemsPerPage, totalItems)}</strong> of{" "}
        <strong>{totalItems}</strong> entries
      </div>

      <div className="d-flex align-items-center gap-1">
        <Button
          variant="outline"
          className="p-1 px-2 border-0"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </Button>

        {pages[0] > 1 && (
          <>
            <Button
              variant="outline"
              className={`p-1 px-2 border-0 ${currentPage === 1 ? 'fw-bold text-primary' : 'text-muted'}`}
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {pages[0] > 2 && <span className="text-muted px-1">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "primary" : "outline"}
            className={`p-1 px-3 ${currentPage === page ? "fw-bold" : "border-0 text-muted"}`}
            style={currentPage === page ? { borderRadius: "8px" } : {}}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="text-muted px-1">...</span>
            )}
            <Button
              variant="outline"
              className={`p-1 px-2 border-0 ${currentPage === totalPages ? 'fw-bold text-primary' : 'text-muted'}`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          className="p-1 px-2 border-0"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
