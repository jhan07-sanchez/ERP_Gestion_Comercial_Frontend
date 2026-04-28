/**
 * 🛠️ UTILIDADES AUXILIARES
 *
 * Funciones puras de propósito general reutilizables en todo el ERP.
 * Cubren patrones comunes de strings, routing, y transformación de datos.
 */

/**
 * Obtiene la primera letra de un nombre (para avatares).
 * Reemplaza el patrón `nombre.charAt(0).toUpperCase()` repetido en componentes.
 *
 * @example
 * getInitial("Juan Pérez") // "J"
 * getInitial("")           // "?"
 */
export function getInitial(name: string): string {
  return name?.charAt(0)?.toUpperCase() || "?";
}

/**
 * Parsea un route param `id` de string a number de forma segura.
 * Reemplaza el patrón `Number(id)` / `parseInt(id, 10)` repetido.
 *
 * @example
 * parseRouteId("42")       // 42
 * parseRouteId(undefined)  // undefined
 * parseRouteId("abc")      // undefined
 */
export function parseRouteId(id: string | undefined): number | undefined {
  if (!id) return undefined;
  const n = Number(id);
  return isNaN(n) || n <= 0 ? undefined : n;
}

/**
 * Genera un string de pluralización simple en español.
 *
 * @example
 * pluralize(1, "producto")   // "1 producto"
 * pluralize(5, "producto")   // "5 productos"
 * pluralize(0, "unidad", "unidades") // "0 unidades"
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${word}`;
}

/**
 * Genera un slug a partir de un texto (para URLs/IDs).
 *
 * @example
 * slugify("Hola Mundo!") // "hola-mundo"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Compara dos valores para ordenación (para .sort()).
 * Soporta strings, numbers y dates.
 *
 * @example
 * items.sort((a, b) => compareValues(a.nombre, b.nombre, 'asc'))
 */
export function compareValues<T extends string | number | Date>(
  a: T,
  b: T,
  order: "asc" | "desc" = "asc",
): number {
  let result = 0;

  if (typeof a === "string" && typeof b === "string") {
    result = a.localeCompare(b, "es");
  } else if (a instanceof Date && b instanceof Date) {
    result = a.getTime() - b.getTime();
  } else {
    result = (a as number) - (b as number);
  }

  return order === "asc" ? result : -result;
}

/**
 * Debounce: retrasa la ejecución de una función hasta que pase un intervalo
 * sin que se vuelva a invocar.
 *
 * @example
 * const debouncedSearch = debounce(search, 300);
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Genera un ID único simple (no criptográfico, para keys de UI).
 *
 * @example
 * uniqueId("row") // "row-1a2b3c"
 */
export function uniqueId(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Agrupa un array por una clave.
 *
 * @example
 * groupBy(ventas, 'estado')
 * // { PENDIENTE: [...], COMPLETADA: [...] }
 */
export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
      return groups;
    },
    {} as Record<string, T[]>,
  );
}
