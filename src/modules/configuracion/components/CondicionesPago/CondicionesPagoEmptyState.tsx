import React from 'react';
import { Card, Button } from '@/shared/components/ui';
import { IconFileInvoice, IconPlus } from '@tabler/icons-react';

interface CondicionesPagoEmptyStateProps {
    onNewClick?: () => void;
    isSearchEmpty?: boolean;
    onClearSearch?: () => void;
}

export const CondicionesPagoEmptyState: React.FC<CondicionesPagoEmptyStateProps> = ({
    onNewClick,
    isSearchEmpty,
    onClearSearch,
}) => {
    return (
        <Card className="border-primary-100 shadow-sm border-dashed">
            <Card.Content className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-300 mb-6">
                    <IconFileInvoice size={40} stroke={1.5} />
                </div>
                
                <h3 className="text-xl font-bold text-primary-900 mb-2">
                    {isSearchEmpty 
                        ? 'No se encontraron resultados' 
                        : 'No existen condiciones de pago registradas'}
                </h3>
                
                <p className="text-primary-500 max-w-md mb-8">
                    {isSearchEmpty 
                        ? 'Intenta ajustando los filtros de búsqueda o limpia los filtros para ver todas las condiciones.' 
                        : 'Las condiciones de pago permiten definir cuándo un cliente deberá cancelar una factura. Comienza creando tu primera condición.'}
                </p>

                {isSearchEmpty ? (
                    <Button variant="secondary" onClick={onClearSearch}>
                        Limpiar filtros
                    </Button>
                ) : (
                    onNewClick && (
                        <Button variant="primary" onClick={onNewClick} className="gap-2">
                            <IconPlus size={18} />
                            <span>Crear condición de pago</span>
                        </Button>
                    )
                )}
            </Card.Content>
        </Card>
    );
};
