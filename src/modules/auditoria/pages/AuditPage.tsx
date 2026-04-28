// src/modules/auditoria/pages/AuditPage.tsx
import React, { useState } from 'react';
import AuditTable from '../components/AuditTable';
import AuditFilters from '../components/AuditFilters';
import AuditDetailModal from '../components/AuditDetailModal';
import { useAudit } from '../hooks/useAudit';
import type { AuditLog } from '../types';
import { PageContainer, PageHeader, Button } from '@/shared/components/ui';
import { IconHistory, IconDownload, IconChartBar, IconAlertCircle, IconLock, IconUsers } from '@tabler/icons-react';

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
        <PageContainer>
            <PageHeader
                title="Centro de Auditoría"
                subtitle="Seguimiento detallado de todas las acciones del ERP"
                icon={<IconHistory size={24} />}
                actions={
                    <Button
                        onClick={exportData}
                        variant="secondary"
                        className="w-full sm:w-auto shadow-sm"
                    >
                        <IconDownload size={18} className="mr-2" />
                        Exportar CSV
                    </Button>
                }
            />

            <div className="space-y-6">
                {/* KPI Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">
                    <KPIItem
                        label="Registros"
                        value={count.toLocaleString()}
                        color="from-accent-500 to-accent-600"
                        icon={<IconChartBar size={20} />}
                    />
                    <KPIItem
                        label="Alertas"
                        value={stats?.errores_hoy?.toString() || '0'}
                        color="from-danger-500 to-pink-600"
                        icon={<IconAlertCircle size={20} />}
                    />
                    <KPIItem
                        label="Accesos"
                        value={stats?.accesos_denegados?.toString() || '0'}
                        color="from-warning-500 to-orange-600"
                        icon={<IconLock size={20} />}
                    />
                    <KPIItem
                        label="Usuarios"
                        value={stats?.usuarios_activos?.toString() || '0'}
                        color="from-success-500 to-teal-600"
                        icon={<IconUsers size={20} />}
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
                        <span className="text-[10px] sm:text-xs font-black text-primary-400 uppercase tracking-widest bg-primary-100/50 px-2 py-1 rounded-md border border-primary-200/50">
                            {count} Registros Encontrados
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={filters.page === 1 || isLoading}
                                onClick={() => handlePageChange((filters.page || 1) - 1)}
                                className="p-2 disabled:opacity-30 hover:bg-primary-100 rounded-lg transition-colors border border-transparent hover:border-primary-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span className="text-[11px] font-black w-24 text-center tabular-nums text-primary-700">Pág. {filters.page} / {totalPages || 1}</span>
                            <button
                                disabled={filters.page === totalPages || isLoading}
                                onClick={() => handlePageChange((filters.page || 1) + 1)}
                                className="p-2 disabled:opacity-30 hover:bg-primary-100 rounded-lg transition-colors border border-transparent hover:border-primary-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            </div>

            {/* Detail Modal */}
            {selectedLog && (
                <AuditDetailModal
                    log={selectedLog}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </PageContainer>
    );
};

const KPIItem = ({ label, value, color, icon }: { label: string, value: string, color: string, icon: React.ReactNode }) => (
    <div className="bg-white p-3 sm:p-5 rounded-2xl border border-primary-200 shadow-sm relative overflow-hidden group hover:border-accent-200 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 relative z-10">
            <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${color} rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-lg shadow-current/10 shrink-0`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-black text-primary-400 uppercase tracking-wider mb-0.5 truncate">{label}</p>
                <p className="text-sm sm:text-2xl font-black text-primary-900 tracking-tight">{value}</p>
            </div>
        </div>
        <div className={`absolute -right-4 -bottom-4 w-12 h-12 sm:w-20 lg:h-20 bg-gradient-to-br ${color} opacity-[0.03] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
    </div>
);

export default AuditPage;
