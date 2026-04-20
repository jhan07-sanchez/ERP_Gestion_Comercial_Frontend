/**
 * ✅ NUEVO COMPONENTE: Paginación
 */

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) {
    const pageSizes = [10, 20, 50, 100];

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t">
            {/* Info */}
            <div className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>{" "}
                a{" "}
                <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalCount)}
                </span>{" "}
                de <span className="font-medium">{totalCount}</span> resultados
            </div>

            {/* Controles */}
            <div className="flex items-center gap-4">
                {/* Tamaño de página */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Items por página:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        {pageSizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Navegación */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Anterior
                    </button>

                    <span className="text-sm text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
