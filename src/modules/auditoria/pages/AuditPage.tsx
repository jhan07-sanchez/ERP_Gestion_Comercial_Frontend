// src/modules/auditoria/pages/AuditPage.tsx
import React, { useState } from 'react';
import AuditTable from '../components/AuditTable';
import AuditFilters from '../components/AuditFilters';
import AuditDetailModal from '../components/AuditDetailModal';
import { useAudit } from '../hooks/useAudit';
import type { AuditLog } from '../types';

const AuditPage: React.FC = () => {
    const {
        logs,
        count,
        stats,
        isLoading,
        filters,
        handleFilterChange,
        handlePageChange,
        exportData
    } = useAudit();

    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetail = (log: AuditLog) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    const totalPages = Math.ceil(count / (filters.page_size || 20));

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Centro de Auditoría
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Seguimiento detallado de todas las acciones del ERP
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportData}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Exportar CSV
                    </button>
                </div>
            </div>

            {/* KPI Stats (Premium version) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                <KPIItem
                    label="Registros Totales"
                    value={count.toLocaleString()}
                    color="from-blue-500 to-indigo-600"
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                />
                <KPIItem
                    label="Alertas del Sistema"
                    value={stats?.errores_hoy?.toString() || '0'}
                    color="from-rose-500 to-pink-600"
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                />
                <KPIItem
                    label="Control de Acceso"
                    value={stats?.accesos_denegados?.toString() || '0'}
                    color="from-amber-500 to-orange-600"
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                />
                <KPIItem
                    label="Usuarios Activos"
                    value={stats?.usuarios_activos?.toString() || '0'}
                    color="from-emerald-500 to-teal-600"
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
            </div>

            {/* Filters */}
            <AuditFilters
                onFilter={(newFilters) => handleFilterChange(newFilters)}
                isLoading={isLoading}
            />

            {/* Table Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        {count} Registros Encontrados
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            disabled={filters.page === 1 || isLoading}
                            onClick={() => handlePageChange((filters.page || 1) - 1)}
                            className="p-2 disabled:opacity-30 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm font-bold w-20 text-center">Pág. {filters.page} / {totalPages || 1}</span>
                        <button
                            disabled={filters.page === totalPages || isLoading}
                            onClick={() => handlePageChange((filters.page || 1) + 1)}
                            className="p-2 disabled:opacity-30 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <AuditTable
                    logs={logs}
                    isLoading={isLoading}
                    onViewDetail={handleViewDetail}
                />
            </div>

            {/* Detail Modal */}
            {selectedLog && (
                <AuditDetailModal
                    log={selectedLog}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

const KPIItem = ({ label, value, color, icon }: { label: string, value: string, color: string, icon: React.ReactNode }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-4 relative z-10">
            <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-current/10`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
            </div>
        </div>
    </div>
);

export default AuditPage;
