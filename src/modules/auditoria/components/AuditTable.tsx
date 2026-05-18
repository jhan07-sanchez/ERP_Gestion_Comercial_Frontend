// src/modules/auditoria/components/AuditTable.tsx
import React from 'react';
import type { AuditLog } from '../types';

interface AuditTableProps {
    logs: AuditLog[];
    onViewDetail: (log: AuditLog) => void;
    isLoading: boolean;
}

const AuditTable: React.FC<AuditTableProps> = ({ logs, onViewDetail, isLoading }) => {
    if (isLoading) {
        return (
            <div className="w-full space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-primary-50 border border-primary-100 rounded-2xl w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-primary-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-primary-50/50 text-primary-500 border-b border-primary-200">
                        <tr>
                            <th className="px-4 sm:px-6 py-4 font-black uppercase text-xs tracking-widest">Acción</th>
                            <th className="hidden md:table-cell px-6 py-4 font-black uppercase text-xs tracking-widest">Módulo</th>
                            <th className="hidden sm:table-cell px-6 py-4 font-black uppercase text-xs tracking-widest">Descripción</th>
                            <th className="hidden lg:table-cell px-6 py-4 font-black uppercase text-xs tracking-widest">Usuario</th>
                            <th className="px-4 sm:px-6 py-4 font-black uppercase text-xs tracking-widest text-right">Fecha</th>
                            <th className="px-4 py-4 font-black uppercase text-xs tracking-widest text-center">Ver</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100">
                        {logs.length > 0 ? logs.map((log) => (
                            <tr key={log.id} className="group hover:bg-primary-50/50 transition-all border-l-2 border-l-transparent hover:border-l-accent-500">
                                <td className="px-4 sm:px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 min-w-[36px] rounded-xl bg-white flex items-center justify-center text-lg shadow-sm border border-primary-100 group-hover:border-accent-100 group-hover:bg-accent-50/20 transition-all">
                                            {log.icono}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`px-2 py-0.5 rounded-md text-xs opacity-80 w-fit font-black uppercase tracking-wider ${getActionBadgeColor(log.accion)}`}>
                                                {log.accion_display}
                                            </span>
                                            <span className="text-xs font-bold text-primary-400 mt-0.5 md:hidden uppercase">
                                                {log.modulo_display}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden md:table-cell px-6 py-4">
                                    <span className="font-black text-primary-600 px-2 py-1 bg-primary-50 rounded-lg text-xs border border-primary-200 uppercase tracking-tighter">
                                        {log.modulo_display}
                                    </span>
                                </td>
                                <td className="hidden sm:table-cell px-6 py-4 max-w-xs xl:max-w-md">
                                    <p className="text-primary-500 font-bold text-xs leading-relaxed truncate group-hover:text-primary-900 transition-colors">
                                        {log.descripcion}
                                    </p>
                                </td>
                                <td className="hidden lg:table-cell px-6 py-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-accent-600 font-black text-xs uppercase border border-accent-100">
                                            {log.usuario_nombre.charAt(0)}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-black text-primary-900 text-xs truncate uppercase tracking-tighter">{log.usuario_nombre}</span>
                                            <span className="text-xs opacity-80 text-primary-400 font-bold tabular-nums tracking-widest">{log.ip_address}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-right">
                                    <div className="flex flex-col items-end whitespace-nowrap">
                                        <span className="text-primary-900 font-black text-xs tabular-nums">
                                            {new Date(log.fecha_hora).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-primary-400 font-bold tabular-nums">
                                            {new Date(log.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <button
                                        onClick={() => onViewDetail(log)}
                                        className="p-2 hover:bg-accent-50 text-accent-600 rounded-xl transition-all active:scale-90 border border-transparent hover:border-accent-100"
                                        title="Ver detalles"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-3xl">🔍</div>
                                        <div className="space-y-1">
                                            <p className="font-black text-primary-900 text-lg">Sin resultados</p>
                                            <p className="text-primary-400 text-sm">Prueba ajustando los filtros de búsqueda.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const getActionBadgeColor = (action: string): string => {
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

export default AuditTable;
