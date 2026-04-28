/**
 * 📦 BARREL EXPORT — shared/utils
 *
 * Punto de entrada único para todas las utilidades del ERP.
 * Los módulos deben importar desde aquí en lugar de archivos individuales.
 *
 * @example
 * import { formatCurrency, toNumber, isValidEmail } from "@/shared/utils";
 */

// Formateo de datos (moneda, fechas, texto)
export {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeDate,
  formatNumber,
  formatNumberInput,
  parseNumberInput,
  formatPercentage,
  formatPhone,
  formatNIT,
  formatFileSize,
  truncateText,
  truncateProductos,
  capitalize,
  toTitleCase,
  getInitials,
  numberClass,
} from "./formatters";

// Cálculos numéricos
export {
  toNumber,
  parseFormattedNumber,
  calcSubtotal,
  sumField,
  safePercent,
  calcMargin,
  calcProfit,
  applyTax,
  calcTaxAmount,
  clamp,
} from "./calculations";

// Validaciones
export {
  isValidEmail,
  isValidPhone,
  isValidNIT,
  isValidCedula,
  isPositiveNumber,
  isNonNegativeNumber,
  isNonEmptyString,
  hasMinLength,
  hasMaxLength,
  isInRange,
  isNotFutureDate,
  isNotPastDate,
  isDateAfter,
  isValidURL,
  isValidProductCode,
  validatePassword,
  areEqual,
  sanitizeInput,
  isValidFileExtension,
  isValidFileSize,
} from "./validators";

// Manejo de errores de API
export {
  getApiErrorMessage,
  getApiErrorStatus,
} from "./apiError";
export type { ApiErrorShape } from "./apiError";

// Permisos y roles
export {
  hasRole,
  isStaff,
  canAccess,
} from "./permissions";

// Constantes
export {
  ROUTES,
  APP_NAME,
  API_TIMEOUT,
} from "./constants";

// Helpers generales
export {
  getInitial,
  parseRouteId,
  pluralize,
  slugify,
  compareValues,
  debounce,
  uniqueId,
  groupBy,
} from "./helpers";
