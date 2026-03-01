/**
 * Paginación para historial de cambios.
 */

interface HistorialCambiosPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
}

const PAGE_SIZES = [10, 20, 50, 100];

export function HistorialCambiosPagination({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: HistorialCambiosPaginationProps) {
  const from = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/50 rounded-b-lg">
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-medium">{from}</span> a{' '}
        <span className="font-medium">{to}</span> de{' '}
        <span className="font-medium">{totalCount}</span> resultados
      </div>
      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Por página:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={isLoading}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">Página {currentPage} de {totalPages || 1}</span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
