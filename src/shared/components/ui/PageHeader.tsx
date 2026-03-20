import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  backButton?: React.ReactNode;
}

/**
 * 📑 PAGEHEADER COMPONENT
 * 
 * Encabezado responsivo para páginas.
 * En móvil: Se apilar verticalmente y centra acciones opcionalmente.
 * En desktop: Alineación horizontal con espacio entre título y acciones.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  icon,
  backButton
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          {backButton}
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
              {icon}
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-primary-900 tracking-tight">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-sm md:text-base text-primary-500 font-medium ml-0 sm:ml-0 md:ml-0">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 sm:self-center w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
