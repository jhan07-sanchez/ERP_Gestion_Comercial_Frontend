/**
 * 📝 TEXTAREA COMPONENT
 * Componente Textarea para formularios con soporte a validación
 */

import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function Textarea({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  disabled,
  ...props
}: TextareaProps) {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-primary-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-2
          border rounded-button
          focus:outline-none focus:ring-2 focus:ring-accent-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
          ${error ? 'border-danger-500' : 'border-primary-300'}
          ${className}
        `}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="text-sm text-danger-600 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-primary-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
