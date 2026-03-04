/**
 * 📄 SECCIÓN: DOCUMENTACIÓN Y NUMERACIÓN
 * Control de prefijos y consecutivos de facturas, compras y recibos.
 */

import React, { useState } from 'react';
import { Card, Input, Button, Badge } from '@/shared/components/ui';
import { IconFileInvoice, IconAlertTriangle, IconRefresh, IconHash } from '@tabler/icons-react';
import { useAlert } from '@/shared/components/alerts';
import type { Configuracion, ConfiguracionUpdateInput, ResetConsecutivoInput } from '../types/configuracion.types';

interface Props {
    config: Configuracion;
    onSave: (data: ConfiguracionUpdateInput) => Promise<void>;
    onReset: (data: ResetConsecutivoInput) => Promise<void>;
    isSaving: boolean;
}

export const SeccionDocumentacion: React.FC<Props> = ({ config, onSave, onReset, isSaving }) => {
    const { confirm } = useAlert();
    const [formData, setFormData] = useState<ConfiguracionUpdateInput>({
        prefijo_factura: config.prefijo_factura,
        prefijo_compra: config.prefijo_compra,
        prefijo_recibo: config.prefijo_recibo,
        digitos_consecutivo: config.digitos_consecutivo,
        terminos_condiciones: config.terminos_condiciones,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'digitos_consecutivo' ? Number(value) : value
        }));
    };

    const handleReset = async (tipo: 'factura' | 'compra' | 'recibo') => {
        const label = tipo === 'factura' ? 'Facturación' : tipo === 'compra' ? 'Compras' : 'Recibos POS';

        const isConfirmed = await confirm(
            '¿Reiniciar Consecutivo?',
            `Estás a punto de cambiar el próximo número de ${label}. Esto puede causar duplicados si no se maneja con cuidado. ¿Deseas continuar?`,
            'warning'
        );

        if (isConfirmed) {
            onReset({
                tipo,
                nuevo_consecutivo: 1, // Por defecto a 1, o podríamos pedir el número
                confirmar: true
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <Card.Header className="flex items-center gap-2">
                    <IconFileInvoice size={20} className="text-blue-600" />
                    <Card.Title>Prefijos y Formato</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Prefijo Factura"
                            name="prefijo_factura"
                            value={formData.prefijo_factura}
                            onChange={handleChange}
                            placeholder="FAC"
                            helperText={`Próxima: ${config.numero_factura_preview}`}
                        />
                        <Input
                            label="Prefijo Compra"
                            name="prefijo_compra"
                            value={formData.prefijo_compra}
                            onChange={handleChange}
                            placeholder="COM"
                            helperText={`Próxima: ${config.numero_compra_preview}`}
                        />
                        <Input
                            label="Prefijo Recibo POS"
                            name="prefijo_recibo"
                            value={formData.prefijo_recibo}
                            onChange={handleChange}
                            placeholder="REC"
                            helperText={`Próxima: ${config.numero_recibo_preview}`}
                        />
                        <Input
                            label="Dígitos Consecutivo"
                            name="digitos_consecutivo"
                            type="number"
                            value={formData.digitos_consecutivo}
                            onChange={handleChange}
                            min={3}
                            max={8}
                            leftIcon={<IconHash size={18} />}
                        />
                    </div>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header className="flex items-center gap-2">
                    <IconRefresh size={20} className="text-blue-600" />
                    <Card.Title>Control de Consecutivos</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
                        <IconAlertTriangle className="text-amber-500 shrink-0" size={24} />
                        <div>
                            <p className="text-sm font-semibold text-amber-900">Zona de Cuidado</p>
                            <p className="text-xs text-amber-800">
                                Reiniciar los consecutivos volverá el contador a 1. Úsalo solo al inicio de un nuevo año fiscal o si hubo un error crítico en la numeración.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-primary-50 transition-colors">
                            <div>
                                <p className="text-sm font-medium">Consecutivo Facturación</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="info">Actual: {config.consecutivo_factura}</Badge>
                                    <span className="text-xs text-primary-500">→</span>
                                    <span className="text-xs font-mono font-bold text-blue-600">{config.numero_factura_preview}</span>
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleReset('factura')}>
                                Reiniciar
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-primary-50 transition-colors">
                            <div>
                                <p className="text-sm font-medium">Consecutivo Compras</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="info">Actual: {config.consecutivo_compra}</Badge>
                                    <span className="text-xs text-primary-500">→</span>
                                    <span className="text-xs font-mono font-bold text-blue-600">{config.numero_compra_preview}</span>
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleReset('compra')}>
                                Reiniciar
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-primary-50 transition-colors">
                            <div>
                                <p className="text-sm font-medium">Consecutivo Recibos POS</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="info">Actual: {config.consecutivo_recibo}</Badge>
                                    <span className="text-xs text-primary-500">→</span>
                                    <span className="text-xs font-mono font-bold text-blue-600">{config.numero_recibo_preview}</span>
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleReset('recibo')}>
                                Reiniciar
                            </Button>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header className="flex items-center gap-2">
                    <IconFileInvoice size={20} className="text-blue-600" />
                    <Card.Title>Términos y Condiciones (Pie de Factura)</Card.Title>
                </Card.Header>
                <Card.Content>
                    <textarea
                        name="terminos_condiciones"
                        value={formData.terminos_condiciones}
                        onChange={handleChange}
                        className="w-full h-32 p-3 border border-primary-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Escribe aquí los términos que aparecerán en tus facturas..."
                    />
                </Card.Content>
            </Card>

            <div className="flex justify-end p-4 bg-white border-t sticky bottom-0 z-10">
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    className="px-8"
                >
                    Guardar Cambios
                </Button>
            </div>
        </form>
    );
};
