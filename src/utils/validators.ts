/**
 * ✅ UTILIDADES DE VALIDACIÓN
 *
 * Funciones compartidas para validar datos en toda la aplicación
 * Validaciones del lado del cliente (el backend debe tener sus propias validaciones)
 */

/**
 * Validar email
 *
 * @param email - Email a validar
 * @returns true si es válido
 *
 * @example
 * isValidEmail('usuario@ejemplo.com') // true
 * isValidEmail('invalido') // false
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validar teléfono colombiano (10 dígitos)
 *
 * @param phone - Teléfono a validar
 * @returns true si es válido
 *
 * @example
 * isValidPhone('3001234567') // true
 * isValidPhone('300123') // false
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 && /^[0-9]+$/.test(cleaned);
}

/**
 * Validar NIT colombiano (9-10 dígitos)
 *
 * @param nit - NIT a validar
 * @returns true si es válido
 *
 * @example
 * isValidNIT('900123456-7') // true
 * isValidNIT('123') // false
 */
export function isValidNIT(nit: string): boolean {
  const cleaned = nit.replace(/\D/g, "");
  return cleaned.length >= 9 && cleaned.length <= 10;
}

/**
 * Validar cédula colombiana (6-10 dígitos)
 *
 * @param cedula - Cédula a validar
 * @returns true si es válida
 */
export function isValidCedula(cedula: string): boolean {
  const cleaned = cedula.replace(/\D/g, "");
  return cleaned.length >= 6 && cleaned.length <= 10;
}

/**
 * Validar número positivo
 *
 * @param value - Valor a validar
 * @returns true si es mayor a 0
 *
 * @example
 * isPositiveNumber(10) // true
 * isPositiveNumber(0) // false
 * isPositiveNumber(-5) // false
 */
export function isPositiveNumber(value: number): boolean {
  return !isNaN(value) && value > 0;
}

/**
 * Validar número no negativo
 *
 * @param value - Valor a validar
 * @returns true si es mayor o igual a 0
 *
 * @example
 * isNonNegativeNumber(0) // true
 * isNonNegativeNumber(10) // true
 * isNonNegativeNumber(-5) // false
 */
export function isNonNegativeNumber(value: number): boolean {
  return !isNaN(value) && value >= 0;
}

/**
 * Validar que un string no esté vacío
 *
 * @param value - String a validar
 * @returns true si no está vacío después de trim
 *
 * @example
 * isNonEmptyString('Hola') // true
 * isNonEmptyString('   ') // false
 */
export function isNonEmptyString(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validar longitud mínima
 *
 * @param value - String a validar
 * @param minLength - Longitud mínima
 * @returns true si cumple la longitud mínima
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

/**
 * Validar longitud máxima
 *
 * @param value - String a validar
 * @param maxLength - Longitud máxima
 * @returns true si no excede la longitud máxima
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

/**
 * Validar rango de número
 *
 * @param value - Número a validar
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @returns true si está en el rango
 *
 * @example
 * isInRange(50, 0, 100) // true
 * isInRange(150, 0, 100) // false
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return !isNaN(value) && value >= min && value <= max;
}

/**
 * Validar fecha no futura
 *
 * @param dateString - Fecha en formato ISO
 * @returns true si la fecha no es futura
 *
 * @example
 * isNotFutureDate('2024-01-01') // true (asumiendo que hoy es después)
 * isNotFutureDate('2030-01-01') // false
 */
export function isNotFutureDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Fin del día actual
  return date <= today;
}

/**
 * Validar fecha no pasada
 *
 * @param dateString - Fecha en formato ISO
 * @returns true si la fecha no es pasada
 */
export function isNotPastDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Inicio del día actual
  return date >= today;
}

/**
 * Validar que fecha2 sea posterior a fecha1
 *
 * @param date1 - Primera fecha
 * @param date2 - Segunda fecha
 * @returns true si date2 > date1
 */
export function isDateAfter(date1: string, date2: string): boolean {
  return new Date(date2) > new Date(date1);
}

/**
 * Validar URL
 *
 * @param url - URL a validar
 * @returns true si es una URL válida
 *
 * @example
 * isValidURL('https://ejemplo.com') // true
 * isValidURL('no-es-url') // false
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validar código de producto (formato personalizable)
 *
 * @param code - Código a validar
 * @param pattern - Patrón regex opcional
 * @returns true si es válido
 *
 * @example
 * // Por defecto: permite alfanumérico con guiones
 * isValidProductCode('PROD-001') // true
 * isValidProductCode('PROD 001') // false (espacios no permitidos)
 *
 * // Con patrón personalizado
 * isValidProductCode('ABC-123', /^[A-Z]{3}-\d{3}$/) // true
 */
export function isValidProductCode(code: string, pattern?: RegExp): boolean {
  const defaultPattern = /^[A-Z0-9-]+$/i;
  const regex = pattern || defaultPattern;
  return regex.test(code);
}

/**
 * Validar contraseña segura
 *
 * @param password - Contraseña a validar
 * @param minLength - Longitud mínima (default: 8)
 * @returns Objeto con resultado y mensaje
 *
 * @example
 * validatePassword('abc123')
 * // { valid: false, message: 'Debe tener al menos 8 caracteres' }
 *
 * validatePassword('Abcd1234')
 * // { valid: true }
 */
export function validatePassword(
  password: string,
  minLength = 8,
): { valid: boolean; message?: string } {
  if (password.length < minLength) {
    return {
      valid: false,
      message: `Debe tener al menos ${minLength} caracteres`,
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Debe contener al menos una mayúscula",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Debe contener al menos una minúscula",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Debe contener al menos un número",
    };
  }

  return { valid: true };
}

/**
 * Validar que dos valores sean iguales
 *
 * @param value1 - Primer valor
 * @param value2 - Segundo valor
 * @returns true si son iguales
 *
 * @example
 * // Útil para confirmar contraseñas o emails
 * areEqual('password123', 'password123') // true
 */
export function areEqual(value1: unknown, value2: unknown): boolean {
  return value1 === value2;
}

/**
 * Sanitizar string (remover caracteres peligrosos)
 *
 * @param input - String a sanitizar
 * @returns String sanitizado
 *
 * @example
 * sanitizeInput('<script>alert("XSS")</script>') // "scriptalert("XSS")/script"
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remover < y >
    .trim();
}

/**
 * Validar extensión de archivo
 *
 * @param filename - Nombre del archivo
 * @param allowedExtensions - Extensiones permitidas
 * @returns true si la extensión es permitida
 *
 * @example
 * isValidFileExtension('image.jpg', ['jpg', 'png']) // true
 * isValidFileExtension('doc.pdf', ['jpg', 'png']) // false
 */
export function isValidFileExtension(
  filename: string,
  allowedExtensions: string[],
): boolean {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

/**
 * Validar tamaño máximo de archivo
 *
 * @param fileSizeBytes - Tamaño del archivo en bytes
 * @param maxSizeMB - Tamaño máximo en MB
 * @returns true si no excede el máximo
 *
 * @example
 * isValidFileSize(2097152, 5) // true (2MB < 5MB)
 * isValidFileSize(10485760, 5) // false (10MB > 5MB)
 */
export function isValidFileSize(
  fileSizeBytes: number,
  maxSizeMB: number,
): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSizeBytes <= maxSizeBytes;
}
