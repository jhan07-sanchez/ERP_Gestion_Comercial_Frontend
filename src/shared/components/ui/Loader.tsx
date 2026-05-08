/**
 * 🔄 LOADER COMPONENT
 *
 * Componente de carga (spinner) reutilizable.
 * Parte del design system centralizado.
 */

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary';
}

export function Loader({ size = 'md', variant = 'primary' }: LoaderProps) {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  const variantClass = {
    default: 'border-primary-300',
    primary: 'border-primary',
    secondary: 'border-secondary',
  }[variant];

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClass} border-4 border-transparent rounded-full animate-spin ${variantClass}`} />
    </div>
  );
}
