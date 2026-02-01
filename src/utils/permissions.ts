/**
 * Utilidades para permisos y roles.
 * Centraliza la lógica de autorización en la UI.
 */

import type { User } from '@/auth/auth.types';

/**
 * Comprueba si el usuario tiene un rol por nombre.
 */
export function hasRole(user: User | null, roleName: string): boolean {
  if (!user?.roles?.length) return false;
  return user.roles.some((r) => r.rol_nombre?.toLowerCase() === roleName.toLowerCase());
}

/**
 * Comprueba si el usuario es staff/admin.
 */
export function isStaff(user: User | null): boolean {
  return Boolean(user?.is_staff);
}

/**
 * Comprueba si el usuario puede acceder a una acción (por rol o staff).
 */
export function canAccess(user: User | null, requiredRole?: string): boolean {
  if (!user) return false;
  if (isStaff(user)) return true;
  if (requiredRole) return hasRole(user, requiredRole);
  return true;
}
