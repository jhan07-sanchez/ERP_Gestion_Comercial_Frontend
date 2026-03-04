/**
 * 🔒 SECCIÓN: SEGURIDAD Y POLÍTICAS
 * Configuración de sesiones, contraseñas y accesos.
 */

import React from 'react';
import { Card, Input, Button } from '@/shared/components/ui';
import { IconShieldLock, IconClock, IconKey } from '@tabler/icons-react';

export const SeccionSeguridad: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card>
                <Card.Header className="flex items-center gap-2">
                    <IconShieldLock size={20} className="text-blue-600" />
                    <Card.Title>Políticas de Sesión</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-fiori">
                        <Input
                            label="Tiempo de Expiración de Sesión (minutos)"
                            type="number"
                            defaultValue={60}
                            leftIcon={<IconClock size={18} />}
                        />
                        <div className="flex items-center gap-3 py-2 px-1">
                            <input
                                type="checkbox"
                                id="requerir_mfa"
                                disabled
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 opacity-50"
                            />
                            <label htmlFor="requerir_mfa" className="text-sm font-medium text-primary-400">
                                Requerir Autenticación de Dos Factores (Próximamente)
                            </label>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header className="flex items-center gap-2">
                    <IconKey size={20} className="text-blue-600" />
                    <Card.Title>Seguridad de Contraseñas</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                                <label className="text-sm text-primary-700 font-medium">Mínimo 8 caracteres</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                                <label className="text-sm text-primary-700 font-medium">Requerir mayúsculas y números</label>
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            <div className="flex justify-end p-4 bg-white border-t sticky bottom-0 z-10">
                <Button
                    type="button"
                    variant="primary"
                    disabled
                    className="px-8"
                >
                    Guardar Cambios
                </Button>
            </div>
        </div>
    );
};
