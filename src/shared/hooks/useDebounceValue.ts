import { useState, useEffect } from "react";

/**
 * 📦 HOOK GENÉRICO: useDebounceValue
 *
 * Hook para retrasar la actualización de un valor hasta que haya transcurrido
 * un tiempo especificado sin que el valor cambie. Es ideal para búsquedas.
 *
 * @param value El valor a debounsear
 * @param delay Retraso en milisegundos (por defecto 500ms)
 * @returns El valor debounseado
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearchTerm = useDebounceValue(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // Esto se ejecutará solo después de que el usuario deje de escribir por 500ms
 *   applyFilters({ search: debouncedSearchTerm });
 * }, [debouncedSearchTerm]);
 */
export function useDebounceValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configuramos el temporizador para actualizar el valor después del delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiamos el temporizador si el valor cambia antes de que termine el delay
    // o si el componente se desmonta
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
