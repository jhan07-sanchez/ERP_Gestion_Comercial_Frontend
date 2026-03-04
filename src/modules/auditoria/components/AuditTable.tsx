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
                    <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Acción</th>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Módulo</th>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Descripción</th>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Usuario</th>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider text-right">Fecha</th>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider text-center">Detalle</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {logs.length > 0 ? logs.map((log) => (
                        <tr key={log.id} className="group hover:bg-slate-50/50 transition-all">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-xl shadow-sm border border-slate-100">
                                        {log.icono}
                                    </div>
                                    <div>
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${getActionBadgeColor(log.accion)}`}>
                                            {log.accion_display}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-slate-600 px-2 py-0.5 bg-slate-100 rounded-md text-[10px] border border-slate-200 uppercase">
                                    {log.modulo_display}
                                </span>
                            </td>
                            <td className="px-6 py-4 max-w-sm">
                                <p className="text-slate-500 font-medium leading-relaxed truncate">
                                    {log.descripcion}
                                </p>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px] uppercase border border-indigo-100">
                                        {log.usuario_nombre.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 text-xs">{log.usuario_nombre}</span>
                                        <span className="text-[9px] text-slate-400 font-bold tabular-nums tracking-wider">{log.ip_address}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex flex-col items-end">
                                    <span className="text-slate-900 font-bold text-xs">
                                        {new Date(log.fecha_hora).toLocaleDateString()}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        {new Date(log.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    onClick={() => onViewDetail(log)}
                                    className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-4xl text-slate-200">🔍</span>
                                    <p className="font-medium">No se encontraron registros de auditoría.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const getActionBadgeColor = (action: string): string => {
    const colors: Record<string, string> = {
        'CREAR': 'bg-emerald-50 text-emerald-600 border border-emerald-100',
        'ACTUALIZAR': 'bg-indigo-50 text-indigo-600 border border-indigo-100',
        'ELIMINAR': 'bg-rose-50 text-rose-600 border border-rose-100',
        'LOGIN': 'bg-blue-50 text-blue-600 border border-blue-100',
        'LOGOUT': 'bg-slate-50 text-slate-500 border border-slate-200',
        'ERROR': 'bg-rose-50 text-rose-600 border border-rose-100',
        'ACCESO_DENEGADO': 'bg-orange-50 text-orange-600 border border-orange-100',
        'AJUSTAR_STOCK': 'bg-amber-50 text-amber-600 border border-amber-100',
    };
    return colors[action] || 'bg-slate-50 text-slate-500 border border-slate-200';
};

export default AuditTable;
