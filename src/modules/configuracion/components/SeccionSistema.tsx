/**
 * ⚙️ SECCIÓN: PARÁMETROS DEL SISTEMA
 * Configuración fiscal, moneda e inventario.
 */

import React, { useState } from 'react';
import { Card, Input, Select, Button } from '@/shared/components/ui';
import { IconCurrencyDollar, IconPercentage, IconPackages, IconTruck } from '@tabler/icons-react';
import type { Configuracion, ConfiguracionUpdateInput } from '../types/configuracion.types';

interface Props {
    config: Configuracion;
    onSave: (data: ConfiguracionUpdateInput) => Promise<void>;
    isSaving: boolean;
}

export const SeccionSistema: React.FC<Props> = ({ config, onSave, isSaving }) => {
    const [formData, setFormData] = useState<ConfiguracionUpdateInput>({
        regimen_fiscal: config.regimen_fiscal,
        impuesto_porcentaje: Number(config.impuesto_porcentaje),
        aplicar_impuesto_por_defecto: config.aplicar_impuesto_por_defecto,
        moneda: config.moneda,
        simbolo_moneda: config.simbolo_moneda,
        decimales_precio: config.decimales_precio,
        stock_minimo_global: config.stock_minimo_global,
        alertar_stock_bajo: config.alertar_stock_bajo,
        permitir_descuentos: config.permitir_descuentos,
        descuento_maximo: Number(config.descuento_maximo),
        permitir_venta_sin_stock: config.permitir_venta_sin_stock,
    });

    const handleChange = (name: string, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'impuesto_porcentaje' || name === 'decimales_precio' || name === 'stock_minimo_global' || name === 'descuento_maximo')
                ? Number(value)
                : value
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        handleChange(name, type === 'checkbox' ? checked : value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <Card.Header className="flex items-center gap-2">
                    <IconCurrencyDollar size={20} className="text-blue-600" />
                    <Card.Title>Configuración Fiscal y Moneda</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label="Régimen Fiscal"
                            name="regimen_fiscal"
                            value={formData.regimen_fiscal || ''}
                            onChange={(val) => handleChange('regimen_fiscal', val)}
                            options={[
                                { value: 'SIMPLIFICADO', label: 'Régimen Simplificado' },
                                { value: 'COMUN', label: 'Régimen Común' },
                                { value: 'ESPECIAL', label: 'Régimen Especial' },
                                { value: 'NO_RESPONSABLE', label: 'No Responsable de IVA' },
                            ]}
                        />
                        <Input
                            label="Impuesto (%)"
                            name="impuesto_porcentaje"
                            type="number"
                            value={formData.impuesto_porcentaje}
                            onChange={handleInputChange}
                            leftIcon={<IconPercentage size={18} />}
                            step="0.01"
                            required
                        />
                        <div className="flex items-center gap-3 py-2 px-1">
                            <input
                                type="checkbox"
                                id="aplicar_impuesto_por_defecto"
                                name="aplicar_impuesto_por_defecto"
                                checked={formData.aplicar_impuesto_por_defecto}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="aplicar_impuesto_por_defecto" className="text-sm font-medium text-primary-700">
                                Aplicar impuesto por defecto en ventas
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Moneda"
                                name="moneda"
                                value={formData.moneda || ''}
                                onChange={(val) => handleChange('moneda', val)}
                                options={[
                                    { value: 'COP', label: 'Peso Colombiano (COP)' },
                                    { value: 'USD', label: 'Dólar (USD)' },
                                    { value: 'EUR', label: 'Euro (EUR)' },
                                    { value: 'MXN', label: 'Peso Mexicano (MXN)' },
                                    { value: 'PEN', label: 'Sol Peruano (PEN)' },
                                    { value: 'CLP', label: 'Peso Chileno (CLP)' },
                                    { value: 'ARS', label: 'Peso Argentino (ARS)' },
                                ]}
                            />
                            <Input
                                label="Símbolo"
                                name="simbolo_moneda"
                                value={formData.simbolo_moneda}
                                onChange={handleInputChange}
                                placeholder="$"
                                required
                            />
                        </div>
                    </div>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header className="flex items-center gap-2">
                    <IconPackages size={20} className="text-blue-600" />
                    <Card.Title>Inventario y Alertas</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Stock Mínimo Global"
                            name="stock_minimo_global"
                            type="number"
                            value={formData.stock_minimo_global}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="flex items-center gap-3 py-2 px-1">
                            <input
                                type="checkbox"
                                id="alertar_stock_bajo"
                                name="alertar_stock_bajo"
                                checked={formData.alertar_stock_bajo}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="alertar_stock_bajo" className="text-sm font-medium text-primary-700">
                                Alertar cuando el stock esté bajo
                            </label>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header className="flex items-center gap-2">
                    <IconTruck size={20} className="text-blue-600" />
                    <Card.Title>Políticas de Venta</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="permitir_descuentos"
                                    name="permitir_descuentos"
                                    checked={formData.permitir_descuentos}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="permitir_descuentos" className="text-sm font-medium text-primary-700">
                                    Permitir descuentos en ventas
                                </label>
                            </div>
                            {formData.permitir_descuentos && (
                                <Input
                                    label="Descuento Máximo (%)"
                                    name="descuento_maximo"
                                    type="number"
                                    value={formData.descuento_maximo}
                                    onChange={handleInputChange}
                                    leftIcon={<IconPercentage size={18} />}
                                    required
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-3 py-2 px-1">
                            <input
                                type="checkbox"
                                id="permitir_venta_sin_stock"
                                name="permitir_venta_sin_stock"
                                checked={formData.permitir_venta_sin_stock}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="permitir_venta_sin_stock" className="text-sm font-medium text-primary-700">
                                Permitir vender sin stock disponible
                            </label>
                        </div>
                    </div>
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
