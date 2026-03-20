/**
 * 🔒 SECCIÓN: SEGURIDAD Y POLÍTICAS
 * Configuración de sesiones y accesos con diseño responsivo.
 * Nota: Algunas funciones están en preventa/próximamente.
 */

import React from 'react';
import { Card, Input, Button } from '@/shared/components/ui';
import { IconShieldLock, IconClock, IconKey, IconDeviceFloppy, IconLockAccess, IconCheck } from '@tabler/icons-react';

export const SeccionSeguridad: React.FC = () => {
    return (
        <div className="space-y-6 pb-24 lg:pb-0">
            {/* Sesión Card */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <IconClock size={18} />
                    </div>
                    <Card.Title className="text-sm font-black uppercase tracking-tight text-slate-700">Control de Sesiones</Card.Title>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Tiempo de Inactividad (Minutos)</label>
                            <Input
                                type="number"
                                defaultValue={60}
                                leftIcon={<IconClock size={16} className="text-slate-400" />}
                                className="bg-slate-50/50"
                            />
                        </div>
                        
                        <div className="flex items-center">
                             <label className="flex items-center gap-3 p-4 bg-slate-50/10 border border-dashed border-slate-200 rounded-xl cursor-not-allowed opacity-60 w-full group">
                                <div className="w-5 h-5 rounded-md border-2 border-slate-200 bg-white flex items-center justify-center">
                                    {/* Unchecked */}
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-tight">Autenticación MFA</span>
                                    <p className="text-[9px] font-bold text-blue-400 uppercase">Próximamente disponible</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Password Card */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                        <IconLockAccess size={18} />
                    </div>
                    <Card.Title className="text-sm font-black uppercase tracking-tight text-slate-700">Complejidad de Claves</Card.Title>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SecurityToggle label="Mínimo 8 caracteres" checked={true} />
                        <SecurityToggle label="Requerir Mayúsculas" checked={true} />
                        <SecurityToggle label="Requerir Números" checked={true} />
                        <SecurityToggle label="Requerir Símbolos" checked={false} disabled />
                    </div>
                </Card.Content>
            </Card>

            {/* Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-[40] lg:relative lg:bg-transparent lg:border-none lg:p-0 lg:z-0 lg:flex lg:justify-end">
                <Button
                    type="button"
                    variant="primary"
                    disabled
                    className="w-full lg:w-auto px-10 h-12 shadow-xl shadow-blue-200 lg:shadow-none grayscale"
                    leftIcon={<IconDeviceFloppy size={20} />}
                >
                    Sincronizar Seguridad
                </Button>
            </div>
        </div>
    );
};

const SecurityToggle = ({ label, checked, disabled }: { label: string, checked: boolean, disabled?: boolean }) => (
    <div className={`flex items-center gap-3 p-4 border rounded-2xl transition-all ${disabled ? 'bg-slate-50/50 border-slate-100 opacity-50 cursor-not-allowed' : 'bg-white border-slate-200'}`}>
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
            {checked && <IconCheck size={14} className="text-white" />}
        </div>
        <span className={`text-[11px] font-black uppercase tracking-tight ${disabled ? 'text-slate-400' : 'text-slate-600'}`}>
            {label}
        </span>
    </div>
);
