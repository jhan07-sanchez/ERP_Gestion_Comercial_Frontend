// src/components/ui/Select.tsx
/**
 * 🔽 SELECT COMPONENT
 * 
 * Componente Select/Dropdown profesional
 * 
 * CARACTERÍSTICAS:
 * - Label integrado
 * - Estados: normal, focus, error, disabled
 * - Validación inline
 * - Helper text
 * - Soporte para placeholder
 * 
 * USO:
 * <Select
 *   label="País"
 *   options={paises}
 *   value={selectedPais}
 *   onChange={handleChange}
 *   error="Selecciona un país"
 * />
 */

import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function Select({
  label,
  error,
  helperText,
  fullWidth = true,
  options,
  placeholder = 'Selecciona una opción',
  className = '',
  id,
  onChange,
  ...props
}: SelectProps) {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s/g, '-')}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-primary-700 mb-1.5"
        >
          {label}
          {props.required && <span className="text-danger-600 ml-1">*</span>}
        </label>
      )}

      {/* Select Container */}
      <div className="relative">
        {/* Select */}
        <select
          id={selectId}
          className={`
            block w-full
            px-4 py-2.5 pr-10
            border rounded-button
            text-sm text-primary-900
            bg-white
            appearance-none
            transition-all
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-primary-50 disabled:text-primary-500 disabled:cursor-not-allowed
            ${error
              ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200'
              : 'border-primary-300 focus:border-blue-500 focus:ring-blue-200'
            }
            ${className}
          `}
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Arrow */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className={`w-5 h-5 ${error ? 'text-danger-500' : 'text-primary-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
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

export default Select;