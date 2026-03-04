// src/components/ui/Badge.tsx
/**
 * 🏷️ BADGE COMPONENT
 * 
 * Componente Badge para mostrar estados y etiquetas
 * 
 * VARIANTES:
 * - success: Verde (estados positivos)
 * - warning: Amarillo (advertencias)
 * - danger: Rojo (errores, inactivo)
 * - info: Azul (información)
 * - gray: Gris (neutral)
 * 
 * USO:
 * <Badge variant="success">Activo</Badge>
 * <Badge variant="danger">Inactivo</Badge>
 */

import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  dot?: boolean; // Mostrar punto indicador
  className?: string;
}

export function Badge({
  variant = 'gray',
  size = 'md',
  children,
  dot = false,
  className = '',
}: BadgeProps) {
  // Estilos base
  const baseStyles = `
    inline-flex items-center gap-1.5
    font-medium
    rounded-full
    whitespace-nowrap
  `;

  // Estilos por variante
  const variantStyles = {
    success: `
      bg-success-50 text-success-700
      border border-success-200
    `,
    warning: `
      bg-warning-50 text-warning-700
      border border-warning-200
    `,
    danger: `
      bg-danger-50 text-danger-700
      border border-danger-200
    `,
    info: `
      bg-blue-50 text-blue-700
      border border-blue-200
    `,
    gray: `
      bg-primary-100 text-primary-700
      border border-primary-200
    `,
  };

  // Estilos por tamaño
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  // Color del dot
  const dotColors = {
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    info: 'bg-blue-500',
    gray: 'bg-primary-500',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-2 h-2 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}

export default Badge;