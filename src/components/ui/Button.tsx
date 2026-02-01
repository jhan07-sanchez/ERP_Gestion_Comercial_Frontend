// src/components/ui/Button.tsx
/**
 * 🔘 BUTTON COMPONENT
 * 
 * Componente Button inspirado en SAP Fiori
 * Jerarquía clara de acciones
 * 
 * VARIANTES:
 * - primary: Acción principal (azul)
 * - secondary: Acción secundaria (gris)
 * - danger: Acción destructiva (rojo)
 * - ghost: Acción terciaria (transparente)
 * - success: Acción positiva (verde)
 * 
 * TAMAÑOS:
 * - sm: Pequeño (28px)
 * - md: Mediano (36px) - Default
 * - lg: Grande (44px)
 * 
 * USO:
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 */

import type { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  leftIcon,
  rightIcon,
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Estilos base
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium
    rounded-button
    transition-all
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  // Estilos por variante
  const variantStyles = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700
      active:bg-blue-800
      focus:ring-blue-500
      shadow-sm
    `,
    secondary: `
      bg-primary-100 text-primary-700
      hover:bg-primary-200
      active:bg-primary-300
      focus:ring-primary-500
      border border-primary-300
    `,
    danger: `
      bg-danger-600 text-white
      hover:bg-danger-700
      active:bg-danger-800
      focus:ring-danger-500
      shadow-sm
    `,
    ghost: `
      bg-transparent text-primary-700
      hover:bg-primary-100
      active:bg-primary-200
      focus:ring-primary-500
    `,
    success: `
      bg-success-600 text-white
      hover:bg-success-700
      active:bg-success-800
      focus:ring-success-500
      shadow-sm
    `,
  };

  // Estilos por tamaño
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg
          className="animate-spin -ml-1 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {/* Left Icon */}
      {leftIcon && !isLoading && <span>{leftIcon}</span>}

      {/* Children */}
      {children}

      {/* Right Icon */}
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}

export default Button;