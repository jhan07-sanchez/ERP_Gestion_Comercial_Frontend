// src/modules/auditoria/components/AuditDetailModal.tsx
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { AuditLog } from '../types';

interface AuditDetailModalProps {
    log: AuditLog;
    isOpen: boolean;
    onClose: () => void;
}

const getActionBadgeColor = (action: string) => {
    const colors: Record<string, string> = {
        'CREAR': 'bg-success-50 text-success-600 border border-success-100',
        'ACTUALIZAR': 'bg-accent-50 text-accent-600 border border-accent-100',
        'ELIMINAR': 'bg-danger-50 text-danger-600 border border-danger-100',
        'LOGIN': 'bg-violet-50 text-violet-600 border border-violet-100',
        'LOGOUT': 'bg-primary-50 text-primary-500 border border-primary-200',
        'ERROR': 'bg-danger-100 text-danger-700 border border-danger-200',
        'ACCESO_DENEGADO': 'bg-warning-100 text-warning-700 border border-warning-200',
        'AJUSTAR_STOCK': 'bg-warning-50 text-warning-600 border border-warning-100',
    };
    return colors[action] || 'bg-primary-50 text-primary-500 border border-primary-200';
};

const InfoCard = ({ label, value, icon, subValue }: { label: string, value: string, icon: string, subValue?: string }) => (
    <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 group transition-all duration-300">
        <p className="text-[9px] font-bold uppercase tracking-wider text-primary-400 mb-2">{label}</p>
        <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <div className="min-w-0">
                <p className="font-bold text-primary-900 truncate leading-tight text-sm">{value}</p>
                {subValue && <p className="text-[9px] text-primary-400 font-bold uppercase mt-0.5 truncate">{subValue}</p>}
            </div>
        </div>
    </div>
);

const AuditDetailModal: React.FC<AuditDetailModalProps> = ({ log, isOpen, onClose }) => {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-primary-900/60 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-500"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-300"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-white border border-primary-200 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                                {/* Header with gradient */}
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-accent-600/10 via-accent-600/5 to-transparent pointer-events-none" />

                                <div className="px-8 pb-8 pt-6 relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl border border-primary-100">
                                                {log.icono}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${getActionBadgeColor(log.accion)}`}>
                                                        {log.accion_display}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-primary-300 tabular-nums">ID #{log.id}</span>
                                                </div>
                                                <Dialog.Title as="h3" className="text-xl font-bold text-primary-900 tracking-tight leading-tight">
                                                    {log.descripcion}
                                                </Dialog.Title>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="p-1.5 bg-primary-50 hover:bg-primary-100 rounded-lg text-primary-400 transition-all"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <InfoCard label="Módulo" value={log.modulo_display} icon="🧩" />
                                        <InfoCard label="Usuario" value={log.usuario_nombre} icon="👤" subValue={log.ip_address || undefined} />
                                        <InfoCard label="Fecha y Hora" value={new Date(log.fecha_hora).toLocaleDateString()} icon="📅" subValue={new Date(log.fecha_hora).toLocaleTimeString()} />
                                    </div>

                                    {(log.datos_antes || log.datos_despues) && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-px flex-1 bg-primary-100" />
                                                <h4 className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Detalles técnicos de la acción</h4>
                                                <div className="h-px flex-1 bg-primary-100" />
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {log.datos_antes && (
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-danger-500 px-2 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-danger-500" />
                                                            Estado Anterior
                                                        </p>
                                                        <pre className="p-4 bg-danger-50/30 border border-danger-100 rounded-xl text-[11px] font-mono text-danger-800 overflow-auto max-h-[300px] leading-relaxed">
                                                            {JSON.stringify(log.datos_antes, null, 4)}
                                                        </pre>
                                                    </div>
                                                )}
                                                {log.datos_despues && (
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-success-600 px-2 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                                                            Nuevo Estado
                                                        </p>
                                                        <pre className="p-4 bg-success-50/30 border border-success-100 rounded-xl text-[11px] font-mono text-success-800 overflow-auto max-h-[300px] leading-relaxed">
                                                            {JSON.stringify(log.datos_despues, null, 4)}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {!log.datos_antes && !log.datos_despues && (
                                        <div className="p-10 bg-primary-50 rounded-2xl border border-primary-100 flex flex-col items-center justify-center text-center">
                                            <div className="text-3xl mb-3">ℹ️</div>
                                            <p className="text-primary-500 text-xs font-bold max-w-sm">
                                                Esta acción no generó cambios estructurales en los datos.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AuditDetailModal;
