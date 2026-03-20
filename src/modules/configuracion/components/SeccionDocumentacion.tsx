/**
 * 📄 SECCIÓN: DOCUMENTACIÓN Y NUMERACIÓN
 * Control de prefijos y consecutivos con diseño responsivo y UX de seguridad.
 */

import React, { useState } from 'react';
import { Card, Input, Button, Badge } from '@/shared/components/ui';
import { IconFileInvoice, IconAlertTriangle, IconRefresh, IconHash, IconDeviceFloppy, IconChevronRight } from '@tabler/icons-react';
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
                nuevo_consecutivo: 1,
                confirmar: true
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-24 lg:pb-0">
            {/* Prefijos Card */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <IconFileInvoice size={18} />
                    </div>
                    <Card.Title className="text-sm font-black uppercase tracking-tight text-slate-700">Prefijos y Formato</Card.Title>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Prefijo Factura</label>
                            <Input
                                name="prefijo_factura"
                                value={formData.prefijo_factura}
                                onChange={handleChange}
                                placeholder="FAC"
                                className="bg-slate-50/50 uppercase font-bold"
                            />
                            <p className="text-[9px] font-bold text-blue-500 uppercase px-1">Próxima: {config.numero_factura_preview}</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Prefijo Compra</label>
                            <Input
                                name="prefijo_compra"
                                value={formData.prefijo_compra}
                                onChange={handleChange}
                                placeholder="COM"
                                className="bg-slate-50/50 uppercase font-bold"
                            />
                            <p className="text-[9px] font-bold text-blue-500 uppercase px-1">Próxima: {config.numero_compra_preview}</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Prefijo Recibo POS</label>
                            <Input
                                name="prefijo_recibo"
                                value={formData.prefijo_recibo}
                                onChange={handleChange}
                                placeholder="REC"
                                className="bg-slate-50/50 uppercase font-bold"
                            />
                            <p className="text-[9px] font-bold text-blue-500 uppercase px-1">Próxima: {config.numero_recibo_preview}</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Dígitos de Relleno</label>
                            <Input
                                name="digitos_consecutivo"
                                type="number"
                                value={formData.digitos_consecutivo}
                                onChange={handleChange}
                                min={3}
                                max={8}
                                leftIcon={<IconHash size={16} className="text-slate-400" />}
                                className="bg-slate-50/50"
                            />
                             <p className="text-[9px] font-bold text-slate-400 uppercase px-1 tracking-tighter">Longitud del número (ej: 0001 = 4)</p>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Consecutivos Card */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                        <IconRefresh size={18} />
                    </div>
                    <Card.Title className="text-sm font-black uppercase tracking-tight text-slate-700">Reinicio de Consecutivos</Card.Title>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6 space-y-6">
                    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                            <IconAlertTriangle size={24} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black text-amber-900 uppercase tracking-tight leading-none">Zona de Cuidado</p>
                            <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                                El reinicio volverá el contador a <span className="font-black">0001</span>. Hazlo solo al cambio de año fiscal para evitar conflictos legales o duplicidades.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <ConsecutivoRow 
                            label="Facturación" 
                            current={config.consecutivo_factura} 
                            preview={config.numero_factura_preview} 
                            onReset={() => handleReset('factura')}
                        />
                        <ConsecutivoRow 
                            label="Compras" 
                            current={config.consecutivo_compra} 
                            preview={config.numero_compra_preview} 
                            onReset={() => handleReset('compra')}
                        />
                        <ConsecutivoRow 
                            label="Recibos POS" 
                            current={config.consecutivo_recibo} 
                            preview={config.numero_recibo_preview} 
                            onReset={() => handleReset('recibo')}
                        />
                    </div>
                </Card.Content>
            </Card>

            {/* Términos Card */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        <IconFileInvoice size={18} />
                    </div>
                    <Card.Title className="text-sm font-black uppercase tracking-tight text-slate-700">Cláusulas de Factura</Card.Title>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6 font-mono">
                    <textarea
                        name="terminos_condiciones"
                        value={formData.terminos_condiciones}
                        onChange={handleChange}
                        className="w-full h-40 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-300 resize-none leading-relaxed"
                        placeholder="Escribe aquí los términos que aparecerán en el pie de tus facturas..."
                    />
                </Card.Content>
            </Card>

            {/* Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-[40] lg:relative lg:bg-transparent lg:border-none lg:p-0 lg:z-0 lg:flex lg:justify-end">
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    className="w-full lg:w-auto px-10 h-12 shadow-xl shadow-blue-200 lg:shadow-none"
                    leftIcon={<IconDeviceFloppy size={20} />}
                >
                    Guardar Configuración
                </Button>
            </div>
        </form>
    );
};

const ConsecutivoRow = ({ label, current, preview, onReset }: { label: string, current: number, preview: string, onReset: () => void }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/10 transition-all group gap-4">
        <div className="space-y-1">
            <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{label}</p>
            <div className="flex items-center gap-2">
                <Badge variant="success" className="bg-slate-100 text-slate-600 border-none font-black text-[10px]">INT: {current}</Badge>
                <IconChevronRight size={12} className="text-slate-300" />
                <span className="text-xs font-black text-blue-600 tracking-widest">{preview}</span>
            </div>
        </div>
        <button 
            type="button" 
            onClick={onReset}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-2 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100"
        >
            Reiniciar a 1
        </button>
    </div>
);
