/**
 * ⚙️ SECCIÓN: PARÁMETROS DEL SISTEMA
 * Configuración fiscal, moneda e inventario con diseño responsivo.
 */

import React, { useState } from 'react';
import { Card, Input, Select, Button } from '@/shared/components/ui';
import { IconCurrencyDollar, IconPercentage, IconPackages, IconTruck, IconDeviceFloppy, IconCheck } from '@tabler/icons-react';
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
        <form onSubmit={handleSubmit} className="space-y-6 pb-24 lg:pb-0">
            {/* Fiscal & Currency */}
            <Card className="border-primary-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-primary-50/50 border-b border-primary-100 flex items-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600">
                        <IconCurrencyDollar size={18} />
                    </div>
                    <Card.Title className="text-sm font-black uppercase tracking-tight text-primary-700">Fiscal y Moneda</Card.Title>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-primary-400 px-1">Régimen Fiscal</label>
                            <Select
                                name="regimen_fiscal"
                                value={formData.regimen_fiscal || ''}
                                onChange={(val) => handleChange('regimen_fiscal', val)}
                                className="bg-primary-50/50"
                                options={[
                                    { value: 'SIMPLIFICADO', label: 'Régimen Simplificado' },
                                    { value: 'COMUN', label: 'Régimen Común' },
                                    { value: 'ESPECIAL', label: 'Régimen Especial' },
                                    { value: 'NO_RESPONSABLE', label: 'No Responsable de IVA' },
                                ]}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-primary-400 px-1">Impuesto (%)</label>
                            <Input
                                name="impuesto_porcentaje"
                                type="number"
                                value={formData.impuesto_porcentaje}
                                onChange={handleInputChange}
                                leftIcon={<IconPercentage size={16} className="text-primary-400" />}
                                step="0.01"
                                required
                                className="bg-primary-50/50"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                             <label className="flex items-center gap-3 p-4 bg-primary-50/50 border border-primary-100 rounded-xl cursor-pointer hover:bg-primary-100/50 transition-colors group">
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${formData.aplicar_impuesto_por_defecto ? 'bg-accent-600 border-accent-600' : 'bg-white border-primary-300 group-hover:border-accent-400'}`}>
                                    {formData.aplicar_impuesto_por_defecto && <IconCheck size={14} className="text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    name="aplicar_impuesto_por_defecto"
                                    checked={formData.aplicar_impuesto_por_defecto}
                                    onChange={handleInputChange}
                                    className="hidden"
                                />
                                <span className="text-xs font-black text-primary-600 uppercase tracking-tight">Aplicar impuesto por defecto en ventas</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-primary-400 px-1">Moneda Principal</label>
                                <Select
                                    name="moneda"
                                    value={formData.moneda || ''}
                                    onChange={(val) => handleChange('moneda', val)}
                                    className="bg-primary-50/50"
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
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-primary-400 px-1">Símbolo</label>
                                <Input
                                    name="simbolo_moneda"
                                    value={formData.simbolo_moneda}
                                    onChange={handleInputChange}
                                    placeholder="$"
                                    required
                                    className="bg-primary-50/50 text-center font-black"
                                />
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Inventario Section */}
            <Card className="border-primary-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-primary-50/50 border-b border-primary-100 flex items-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                        <IconPackages size={18} />
                    </div>
                    <Card.Title className="text-sm font-black uppercase tracking-tight text-primary-700">Control de Existencias</Card.Title>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-primary-400 px-1">Stock Mínimo Global</label>
                            <Input
                                name="stock_minimo_global"
                                type="number"
                                value={formData.stock_minimo_global}
                                onChange={handleInputChange}
                                required
                                className="bg-primary-50/50"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center gap-3 p-4 bg-primary-50/50 border border-primary-100 rounded-xl cursor-pointer hover:bg-primary-100/50 transition-colors group w-full">
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${formData.alertar_stock_bajo ? 'bg-orange-600 border-orange-600' : 'bg-white border-primary-300 group-hover:border-orange-400'}`}>
                                    {formData.alertar_stock_bajo && <IconCheck size={14} className="text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    name="alertar_stock_bajo"
                                    checked={formData.alertar_stock_bajo}
                                    onChange={handleInputChange}
                                    className="hidden"
                                />
                                <span className="text-xs font-black text-primary-600 uppercase tracking-tight">Activar alertas de stock crítico</span>
                            </label>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Ventas Section */}
            <Card className="border-primary-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-primary-50/50 border-b border-primary-100 flex items-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600">
                        <IconTruck size={18} />
                    </div>
                    <Card.Title className="text-sm font-black uppercase tracking-tight text-primary-700">Políticas Comerciales</Card.Title>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 p-4 bg-primary-50/50 border border-primary-100 rounded-xl cursor-pointer hover:bg-primary-100/50 transition-colors group w-full">
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${formData.permitir_descuentos ? 'bg-accent-600 border-accent-600' : 'bg-white border-primary-300 group-hover:border-accent-400'}`}>
                                    {formData.permitir_descuentos && <IconCheck size={14} className="text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    name="permitir_descuentos"
                                    checked={formData.permitir_descuentos}
                                    onChange={handleInputChange}
                                    className="hidden"
                                />
                                <span className="text-xs font-black text-primary-600 uppercase tracking-tight">Permitir descuentos</span>
                            </label>
                            
                            {formData.permitir_descuentos && (
                                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-xs font-black uppercase tracking-wider text-primary-400 px-1">Tope Máximo de Descuento (%)</label>
                                    <Input
                                        name="descuento_maximo"
                                        type="number"
                                        value={formData.descuento_maximo}
                                        onChange={handleInputChange}
                                        leftIcon={<IconPercentage size={16} className="text-primary-400" />}
                                        required
                                        className="bg-white border-accent-100"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-start">
                             <label className="flex items-center gap-3 p-4 bg-primary-50/50 border border-primary-100 rounded-xl cursor-pointer hover:bg-primary-100/50 transition-colors group w-full">
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${formData.permitir_venta_sin_stock ? 'bg-accent-600 border-accent-600' : 'bg-white border-primary-300 group-hover:border-accent-400'}`}>
                                    {formData.permitir_venta_sin_stock && <IconCheck size={14} className="text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    name="permitir_venta_sin_stock"
                                    checked={formData.permitir_venta_sin_stock}
                                    onChange={handleInputChange}
                                    className="hidden"
                                />
                                <span className="text-xs font-black text-primary-600 uppercase tracking-tight">Vender sin existencias (Stock Negativo)</span>
                            </label>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-primary-200 z-[40] lg:relative lg:bg-transparent lg:border-none lg:p-0 lg:z-0 lg:flex lg:justify-end">
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    className="w-full lg:w-auto px-10 h-12 shadow-xl shadow-accent-200 lg:shadow-none"
                    leftIcon={<IconDeviceFloppy size={20} />}
                >
                    Guardar Configuración
                </Button>
            </div>
        </form>
    );
};
