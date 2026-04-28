import { Button, Select } from './index';

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
    const pageSizes = [
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 50, label: "50" },
        { value: 100, label: "100" }
    ];

    // Evitar renderizados raros si totalCount es 0
    if (totalCount === 0) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t bg-white rounded-b-xl">
            {/* Info */}
            <div className="text-sm text-primary-700">
                Mostrando{" "}
                <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>{" "}
                a{" "}
                <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalCount)}
                </span>{" "}
                de <span className="font-medium">{totalCount}</span> resultados
            </div>

            {/* Controles */}
            <div className="flex items-center gap-6">
                {/* Tamaño de página */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary-700">Items por página:</span>
                    <div className="w-24">
                        <Select
                            name="pageSize"
                            value={pageSize}
                            onChange={(value) => onPageSizeChange(Number(value))}
                            options={pageSizes}
                        />
                    </div>
                </div>

                {/* Navegación */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="py-1 px-3 h-auto text-sm"
                    >
                        Anterior
                    </Button>

                    <span className="text-sm font-medium text-primary-700 min-w-[100px] text-center">
                        Página {currentPage} de {totalPages || 1}
                    </span>

                    <Button
                        variant="secondary"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="py-1 px-3 h-auto text-sm"
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
