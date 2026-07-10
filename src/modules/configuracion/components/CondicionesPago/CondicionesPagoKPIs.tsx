import React from 'react';
import { Card } from '@/shared/components/ui';
import type { CondicionPago } from '@/modules/configuracion/types/configuracion.types';
import { IconChecklist, IconCheck, IconX } from '@tabler/icons-react';

interface CondicionesPagoKPIsProps {
    condiciones: CondicionPago[];
}

export const CondicionesPagoKPIs: React.FC<CondicionesPagoKPIsProps> = ({ condiciones }) => {
    const total = condiciones.length;
    const activas = condiciones.filter(c => c.activo).length;
    const inactivas = total - activas;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-primary-100 shadow-sm hover:shadow-md transition-shadow">
                <Card.Content className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary-500 mb-1">Total Condiciones</p>
                        <h3 className="text-2xl font-bold text-primary-900">{total}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                        <IconChecklist size={24} />
                    </div>
                </Card.Content>
            </Card>

            <Card className="border-primary-100 shadow-sm hover:shadow-md transition-shadow">
                <Card.Content className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary-500 mb-1">Activas</p>
                        <h3 className="text-2xl font-bold text-success-700">{activas}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center text-success-600">
                        <IconCheck size={24} />
                    </div>
                </Card.Content>
            </Card>

            <Card className="border-primary-100 shadow-sm hover:shadow-md transition-shadow">
                <Card.Content className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary-500 mb-1">Inactivas</p>
                        <h3 className="text-2xl font-bold text-danger-700">{inactivas}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center text-danger-600">
                        <IconX size={24} />
                    </div>
                </Card.Content>
            </Card>
        </div>
    );
};
