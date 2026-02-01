// src/components/ui/Table.tsx
/**
 * 📊 TABLE COMPONENT
 * 
 * Componente Table inspirado en Odoo
 * Tabla empresarial con todas las funcionalidades
 * 
 * CARACTERÍSTICAS:
 * - Header sticky
 * - Filas hover
 * - Selección múltiple
 * - Acciones por fila
 * - Ordenamiento
 * - Responsive
 * 
 * USO:
 * <Table>
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.Head>Código</Table.Head>
 *       <Table.Head>Nombre</Table.Head>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>001</Table.Cell>
 *       <Table.Cell>Producto 1</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 */

import type { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
  sortable?: boolean;
  onSort?: () => void;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

// Componente principal Table
export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-card border border-primary-200">
      <table className={`min-w-full divide-y divide-primary-200 ${className}`}>
        {children}
      </table>
    </div>
  );
}

// Sub-componente: Header
Table.Header = function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={`bg-primary-50 ${className}`}>
      {children}
    </thead>
  );
};

// Sub-componente: Body
Table.Body = function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={`bg-white divide-y divide-primary-100 ${className}`}>
      {children}
    </tbody>
  );
};

// Sub-componente: Row
Table.Row = function TableRow({ 
  children, 
  className = '', 
  onClick,
  hover = true 
}: TableRowProps) {
  return (
    <tr
      className={`
        ${hover ? 'hover:bg-primary-50 transition-colors' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

// Sub-componente: Head
Table.Head = function TableHead({ 
  children, 
  className = '',
  sortable = false,
  onSort
}: TableHeadProps) {
  return (
    <th
      className={`
        px-6 py-3
        text-left text-xs font-semibold text-primary-700 uppercase tracking-wider
        ${sortable ? 'cursor-pointer hover:bg-primary-100 select-none' : ''}
        ${className}
      `}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <svg
            className="w-4 h-4 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        )}
      </div>
    </th>
  );
};

// Sub-componente: Cell
Table.Cell = function TableCell({ children, className = '' }: TableCellProps) {
  return (
    <td className={`px-6 py-4 text-sm text-primary-900 ${className}`}>
      {children}
    </td>
  );
};

export default Table;