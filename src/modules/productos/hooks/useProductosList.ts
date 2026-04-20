import { useState, useCallback, useEffect } from "react";
import { productosAPI } from "../api/productos.api";
import type {
    ProductoList,
    ProductoFilters,
} from "../types";

export function useProductosList() {
    const [productos, setProductos] = useState<ProductoList[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState<ProductoFilters>({});

    const fetchProductos = useCallback(
        async (page = 1, currentFilters: ProductoFilters = filters) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await productosAPI.getProductos(currentFilters, page);
                
                // ✅ TIPADO SEGURO (ERP READY)
                const data = response as unknown;
                let productosNormalizados: ProductoList[] = [];
                let total = 0;

                if (Array.isArray(data)) {
                    productosNormalizados = data;
                    total = data.length;
                } else if (data && typeof data === 'object' && 'results' in data) {
                    const paginatedData = data as { results: ProductoList[]; count?: number };
                    if (Array.isArray(paginatedData.results)) {
                        productosNormalizados = paginatedData.results;
                        total = paginatedData.count ?? paginatedData.results.length;
                    }
                } else {
                    console.warn("⚠️ Formato inesperado de API en productos:", data);
                    productosNormalizados = [];
                    total = 0;
                }

                setProductos(productosNormalizados);
                setCurrentPage(page);
                setTotalCount(total);
            } catch (err: unknown) {
                console.error("❌ Error en fetchProductos:", err);
                setError(
                    err instanceof Error ? err.message : "Error al cargar productos",
                );
                setProductos([]);
                setTotalCount(0);
            } finally {
                setIsLoading(false);
            }
        },
        [filters],
    );

    // 🔥 AUTO-FETCH: Hidratación automática
    useEffect(() => {
        fetchProductos(1, filters);
    }, [fetchProductos, filters]);

    const applyFilters = useCallback(
        (newFilters: ProductoFilters) => {
            setFilters(newFilters);
        },
        [],
    );

    const changePage = useCallback(
        (page: number) => {
            fetchProductos(page, filters);
        },
        [fetchProductos, filters],
    );

    return {
        productos,
        isLoading,
        error,
        currentPage,
        totalCount,
        filters,
        fetchProductos,
        applyFilters,
        changePage,
    };
}
