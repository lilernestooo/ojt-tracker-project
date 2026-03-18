import { ChevronLeft, ChevronRight } from "lucide-react";

export default function InternPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-gray-500">
      <span>Page {currentPage} of {totalPages}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={13} /> Prev
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}