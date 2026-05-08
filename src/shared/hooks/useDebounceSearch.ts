/**
 * 📦 HOOK GENÉRICO: useDebounceSearch
 *
 * Hook reutilizable para búsqueda con debounce.
 * Extraído del patrón repetido en VentaForm (búsqueda de clientes/productos).
 *
 * @example
 * const { results, isSearching, searchTerm, setSearchTerm, showDropdown, setShowDropdown, clear } =
 *   useDebounceSearch<ProductoParaVenta>({
 *     searchFn: (term) => productosVentaAPI.buscarProductos(term),
 *     debounceMs: 300,
 *   });
 */

import { useState, useEffect, useRef, useCallback } from "react";

interface UseDebounceSearchOptions<T> {
  /** Función de búsqueda que recibe el término */
  searchFn: (term: string) => Promise<T[]>;
  /** Tiempo de debounce en milisegundos */
  debounceMs?: number;
  /** Longitud mínima del término para activar la búsqueda */
  minLength?: number;
}

interface UseDebounceSearchReturn<T> {
  results: T[];
  isSearching: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  clear: () => void;
}

export function useDebounceSearch<T>({
  searchFn,
  debounceMs = 300,
  minLength = 1,
}: UseDebounceSearchOptions<T>): UseDebounceSearchReturn<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < minLength) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchFn(searchTerm);
        setResults(data);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [searchTerm, searchFn, debounceMs, minLength]);

  const clear = useCallback(() => {
    setSearchTerm("");
    setResults([]);
    setShowDropdown(false);
  }, []);

  return {
    results,
    isSearching,
    searchTerm,
    setSearchTerm,
    showDropdown,
    setShowDropdown,
    clear,
  };
}
