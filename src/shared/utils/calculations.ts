/**
 * 🔢 UTILIDADES DE CÁLCULO
 *
 * Funciones puras para cálculos numéricos reutilizables en todo el ERP.
 * Centralizan la lógica de coerción numérica y cálculos de negocio
 * que estaban duplicados en formularios y componentes.
 */

/**
 * Convierte un valor de formulario (`number | "" | string | undefined | null`)
 * a un `number` seguro. Elimina la necesidad de `Number(x) || 0` disperso.
 *
 * @example
 * toNumber("")         // 0
 * toNumber("12.5")     // 12.5
 * toNumber(undefined)  // 0
 * toNumber(42)         // 42
 */
export function toNumber(value: number | string | "" | undefined | null): number {
  if (value === "" || value === undefined || value === null) return 0;
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

/**
 * Convierte un string formateado (es-CO: punto=miles, coma=decimal) a number.
 * Útil para inputs de precio/monto que pasan por `formatNumberInput`.
 *
 * @example
 * parseFormattedNumber("1.500,75") // 1500.75
 * parseFormattedNumber("")         // 0
 */
export function parseFormattedNumber(value: string): number {
  if (!value) return 0;
  const normalized = value.replace(/\./g, "").replace(/,/g, ".");
  const n = parseFloat(normalized);
  return isNaN(n) ? 0 : n;
}

/**
 * Calcula subtotal (cantidad × precio unitario).
 * Ambos parámetros aceptan `number | ""` de formularios.
 *
 * @example
 * calcSubtotal(3, 1500) // 4500
 * calcSubtotal("", 100) // 0
 */
export function calcSubtotal(
  cantidad: number | string | "",
  precioUnitario: number | string | "",
): number {
  return toNumber(cantidad) * toNumber(precioUnitario);
}

/**
 * Suma un campo numérico de un array de objetos.
 * Reemplaza los `reduce((sum, d) => sum + (Number(d.field) || 0), 0)` repetidos.
 *
 * @example
 * sumField(detalles, 'subtotal') // 15000
 */
export function sumField<T>(items: T[], field: keyof T): number {
  return items.reduce((sum, item) => sum + toNumber(item[field] as unknown as number), 0);
}

/**
 * Calcula porcentaje de forma segura (sin división por cero).
 *
 * @example
 * safePercent(50, 200)  // 25
 * safePercent(10, 0)    // 0
 */
export function safePercent(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

/**
 * Calcula margen de ganancia: ((venta - costo) / costo) * 100.
 *
 * @example
 * calcMargin(1500, 1000) // 50
 * calcMargin(1000, 0)    // 0
 */
export function calcMargin(precioVenta: number | string, precioCosto: number | string): number {
  const venta = toNumber(precioVenta);
  const costo = toNumber(precioCosto);
  if (costo === 0) return 0;
  return ((venta - costo) / costo) * 100;
}

/**
 * Calcula ganancia bruta: venta - costo.
 *
 * @example
 * calcProfit(1500, 1000) // 500
 */
export function calcProfit(precioVenta: number | string, precioCosto: number | string): number {
  return toNumber(precioVenta) - toNumber(precioCosto);
}

/**
 * Aplica un porcentaje de impuesto a un monto.
 *
 * @example
 * applyTax(1000, 19) // 1190
 */
export function applyTax(amount: number, taxPercent: number): number {
  return amount * (1 + taxPercent / 100);
}

/**
 * Calcula el monto del impuesto.
 *
 * @example
 * calcTaxAmount(1000, 19) // 190
 */
export function calcTaxAmount(amount: number, taxPercent: number): number {
  return amount * (taxPercent / 100);
}

/**
 * Clamp: restringe un valor entre un mínimo y máximo.
 *
 * @example
 * clamp(150, 0, 100) // 100
 * clamp(-5, 0, 100)  // 0
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
