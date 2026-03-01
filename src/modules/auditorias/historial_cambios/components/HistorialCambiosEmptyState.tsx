/**
 * Estado vacío para historial de cambios.
 */

import { Card } from '@/components/ui';

interface HistorialCambiosEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function HistorialCambiosEmptyState({
  hasFilters = false,
  onClearFilters,
}: HistorialCambiosEmptyStateProps) {
  return (
    <Card>
      <Card.Content className="py-12 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {hasFilters ? 'No se encontraron logs' : 'No hay registros de cambios'}
        </h3>
        <p className="text-gray-600 max-w-sm mx-auto mb-4">
          {hasFilters
            ? 'Prueba ajustando los filtros para ver más resultados.'
            : 'Los registros de actividad aparecerán aquí cuando se realicen acciones en el sistema.'}
        </p>
        {hasFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Limpiar filtros
          </button>
        )}
      </Card.Content>
    </Card>
  );
}
