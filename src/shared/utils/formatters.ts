import { useConfigStore } from "@/shared/store/config.store";

/**
 * Formatear moneda según configuración global
 *
 * @param amount - Cantidad a formatear
 * @param showDecimals - Si debe mostrar decimales (default: false)
 */
export function formatCurrency(amount: number, showDecimals = false): string {
  const state = useConfigStore.getState();
  const config = state.config;

  if (config) {
    const convertedAmount = state.convertPrice(amount);
    const decimals = showDecimals ? 2 : config.decimales_precio || 0;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: config.moneda || "COP",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(convertedAmount);
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Formatear fecha en formato corto (DD/MM/YYYY)
 *
 * @param dateString - Fecha en formato ISO o Date
 * @returns Fecha formateada
 *
 * @example
 * formatDate('2024-01-15') // "15/01/2024"
 */
export function formatDate(dateString: string | Date, includeTime = false): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  if (includeTime) {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/**
 * Formatear fecha y hora
 *
 * @param dateString - Fecha en formato ISO o Date
 * @returns Fecha y hora formateadas
 *
 * @example
 * formatDateTime('2024-01-15T14:30:00') // "15/01/2024, 14:30"
 */
export function formatDateTime(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Formatear solo la hora (HH:mm)
 *
 * @param dateString - Fecha en formato ISO o Date
 * @returns Hora formateada
 *
 * @example
 * formatTime('2024-01-15T14:30:00') // "14:30"
 */
export function formatTime(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Formatear fecha relativa (hace X días/horas)
 *
 * @param dateString - Fecha en formato ISO o Date
 * @returns String con tiempo relativo
 *
 * @example
 * formatRelativeDate('2024-01-10') // "Hace 5 días"
 */
export function formatRelativeDate(
  dateString: string | Date,
  includeTime: boolean = false,
): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Hace un momento";

  if (diffMins < 60) {
    return `Hace ${diffMins} minuto${diffMins !== 1 ? "s" : ""}`;
  }

  if (diffHours < 24) {
    return `Hace ${diffHours} hora${diffHours !== 1 ? "s" : ""}`;
  }

  if (diffDays < 30) {
    return `Hace ${diffDays} día${diffDays !== 1 ? "s" : ""}`;
  }

  return formatDate(date, includeTime);
}

/**
 * Formatear número con separadores de miles
 *
 * @param value - Número a formatear
 * @param decimals - Cantidad de decimales (default: 0)
 * @returns String formateado
 *
 * @example
 * formatNumber(1500000) // "1.500.000"
 * formatNumber(1500.5, 2) // "1.500,50"
 */
/**
 * Formatea número normal con separadores
 */
export function formatNumber(value: number | string): string {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("es-CO").format(number);
}

/**
 * Clase estándar para números (consistencia visual)
 */
export const numberClass = "font-mono tabular-nums";

/**
 * Formatea un string numérico para visualización en inputs con separadores de miles (punto)
 * y decimales (coma), siguiendo el estándar es-CO.
 */
export function formatNumberInput(value: string): string {
  if (!value) return "";

  // 1. Detectar si el string ya viene en formato JS (punto como decimal, sin miles)
  // o si viene en formato es-CO (punto como miles, coma como decimal).
  // Si tiene un punto y NO tiene comas, y el punto está cerca del final,
  // probablemente sea un decimal de JS.
  let internalValue = value;
  if (
    value.includes(".") &&
    !value.includes(",") &&
    value.indexOf(".") === value.lastIndexOf(".")
  ) {
    const parts = value.split(".");
    if (parts[1].length <= 2) {
      // Máximo 2 decimales usualmente
      internalValue = value.replace(".", ",");
    }
  }

  // 2. Quitar todos los puntos (ahora estamos seguros que son separadores de miles es-CO)
  const cleanValue = internalValue.replace(/\./g, "");

  // 3. Separar parte entera y decimal por la primera coma encontrada
  const parts = cleanValue.split(",");
  const integerPart = parts[0].replace(/\D/g, ""); // Solo dígitos en la parte entera

  // Si hay más de una coma, unimos el resto como parte decimal
  const decimalPart =
    parts.length > 1 ? parts.slice(1).join("").replace(/\D/g, "") : null;

  // 4. Formatear parte entera con puntos como separadores de miles
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // 5. Reconstruir el string
  if (parts.length > 1) {
    return `${formattedInteger},${decimalPart ?? ""}`;
  }
  return formattedInteger;
}

/**
 * Convierte un string formateado (es-CO) a un valor numérico real (JS string).
 */
export function parseNumberInput(value: string): string {
  if (!value) return "0";
  // Quitar puntos (miles) y cambiar coma por punto (decimal JS)
  const normalized = value.replace(/\./g, "").replace(/,/g, ".");
  return normalized || "0";
}

/**
 * Formatear porcentaje
 *
 * @param value - Valor del porcentaje (0-100)
 * @param decimals - Cantidad de decimales (default: 1)
 * @returns String formateado con símbolo %
 *
 * @example
 * formatPercentage(12.5) // "12,5%"
 * formatPercentage(100, 0) // "100%"
 */
export function formatPercentage(value?: number, decimals = 1): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "0%";
  }

  // protección contra valores absurdos
  if (value > 10000) {
    console.warn("Valor de porcentaje sospechoso:", value);
  }

  return `${value.toFixed(decimals).replace(".", ",")}%`;
}

/**
 * Formatear teléfono colombiano
 *
 * @param phone - Número de teléfono (10 dígitos)
 * @returns String formateado
 *
 * @example
 * formatPhone('3001234567') // "(300) 123-4567"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length !== 10) {
    return phone; // Retornar sin cambios si no tiene 10 dígitos
  }

  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

/**
 * Formatear NIT colombiano
 *
 * @param nit - NIT sin formato
 * @returns String formateado
 *
 * @example
 * formatNIT('9001234567') // "900.123.456-7"
 */
export function formatNIT(nit: string): string {
  const cleaned = nit.replace(/\D/g, "");

  if (cleaned.length < 9) {
    return nit;
  }

  const main = cleaned.slice(0, -1);
  const verifier = cleaned.slice(-1);

  // Agregar puntos cada 3 dígitos desde el final
  const formatted = main.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${formatted}-${verifier}`;
}

/**
 * Formatear tamaño de archivo
 *
 * @param bytes - Tamaño en bytes
 * @returns String formateado (KB, MB, GB)
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Truncar texto largo
 *
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado con "..."
 *
 * @example
 * truncateText('Este es un texto muy largo', 10) // "Este es un..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Formatea lista de productos a formato resumen
 *
 * Ejemplo:
 * "Xiaomi, Motorola, arroz" → "Xiaomi y 2 más..."
 */
export function truncateProductos(text: string): string {
  if (!text) return "----";

  const productos = text.split(",").map((p) => p.trim());

  if (productos.length === 0) return "----";

  if (productos.length === 1) return productos[0];

  return `${productos[0]} y ${productos.length - 1} más...`;
}

/**
 * Capitalizar primera letra
 *
 * @param text - Texto a capitalizar
 * @returns Texto con primera letra mayúscula
 *
 * @example
 * capitalize('hola mundo') // "Hola mundo"
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formatear texto a Title Case
 *
 * @param text - Texto a formatear
 * @returns Texto en Title Case
 *
 * @example
 * toTitleCase('hola mundo') // "Hola Mundo"
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Obtener iniciales de un nombre
 *
 * @param name - Nombre completo
 * @returns Iniciales (máximo 2)
 *
 * @example
 * getInitials('Juan Pérez') // "JP"
 * getInitials('María José García') // "MJ"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
