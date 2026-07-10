import React from 'react';
import { PageHeader, Button } from '@/shared/components/ui';
import { IconPlus, IconRefresh, IconFileText } from '@tabler/icons-react';

interface CondicionesPagoHeaderProps {
    onNewClick: () => void;
    onRefreshClick: () => void;
}

export const CondicionesPagoHeader: React.FC<CondicionesPagoHeaderProps> = ({
    onNewClick,
    onRefreshClick,
}) => {
    return (
        <div className="mb-6">
            <PageHeader
                title="Condiciones de Pago"
                subtitle="Configuración • Condiciones de Pago"
                icon={<IconFileText size={24} stroke={1.5} />}
                actions={
                    <>
                        <Button variant="secondary" onClick={onRefreshClick} className="gap-2">
                            <IconRefresh size={18} />
                            <span className="hidden sm:inline">Actualizar</span>
                        </Button>
                        <Button variant="primary" onClick={onNewClick} className="gap-2">
                            <IconPlus size={18} />
                            <span>Nueva Condición</span>
                        </Button>
                    </>
                }
            />
            <p className="text-primary-500 mt-2 max-w-3xl">
                Administra los diferentes plazos y condiciones bajo los cuales tus clientes pueden cancelar sus facturas. Define políticas claras para mejorar el flujo de caja.
            </p>
        </div>
    );
};
