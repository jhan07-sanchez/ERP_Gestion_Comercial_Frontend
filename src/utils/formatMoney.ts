/**
 * Formateo de montos monetarios.
 * Fuente única para locale y símbolo.
 */

const defaultLocale = 'es-AR';
const defaultCurrency = 'ARS';

/**
 * Formatea un número como moneda.
 */
export function formatMoney(
  value: number,
  options?: { locale?: string; currency?: string }
): string {
  const locale = options?.locale ?? defaultLocale;
  const currency = options?.currency ?? defaultCurrency;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}
