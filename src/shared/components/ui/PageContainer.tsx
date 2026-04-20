import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | '1600';
}

/**
 * 🧱 PAGECONTAINER COMPONENT
 * 
 * Contenedor estandarizado para todas las páginas del ERP.
 * Asegura consistencia en paddings, centrado y ancho máximo.
 */
export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '',
  maxWidth = '1600'
}) => {
  const maxWidthClasses = {
    'sm': 'max-w-screen-sm',
    'md': 'max-w-screen-md',
    'lg': 'max-w-screen-lg',
    'xl': 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    'full': 'max-w-full',
    '1600': 'max-w-[1600px]'
  };

  return (
    <div className={`
      w-full 
      mx-auto 
      px-4 sm:px-6 md:px-8 
      py-4 md:py-6 
      space-y-6 
      ${maxWidthClasses[maxWidth]} 
      ${className}
    `}>
      {children}
    </div>
  );
};

export default PageContainer;
