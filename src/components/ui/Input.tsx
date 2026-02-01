// src/components/ui/Input.tsx
/**
 * 📝 INPUT COMPONENT
 * 
 * Componente Input profesional para formularios
 * 
 * CARACTERÍSTICAS:
 * - Label integrado
 * - Estados: normal, focus, error, disabled
 * - Validación inline
 * - Helper text
 * - Iconos left/right
 * 
 * USO:
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="tu@email.com"
 *   error="Email inválido"
 *   helperText="Usaremos este email para contactarte"
 * />
 */

import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-primary-700 mb-1.5"
        >
          {label}
          {props.required && <span className="text-danger-600 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-primary-400">{leftIcon}</span>
          </div>
        )}

        {/* Input */}
        <input
          id={inputId}
          className={`
            block w-full
            px-4 py-2.5
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            border rounded-button
            text-sm text-primary-900
            placeholder:text-primary-400
            transition-all
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-primary-50 disabled:text-primary-500 disabled:cursor-not-allowed
            ${error
              ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200'
              : 'border-primary-300 focus:border-blue-500 focus:ring-blue-200'
            }
            ${className}
          `}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={error ? 'text-danger-500' : 'text-primary-400'}>
              {rightIcon}
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-sm text-danger-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-primary-500">{helperText}</p>
      )}
    </div>
  );
}

export default Input;