// src/modules/auditoria/hooks/useAudit.ts
import { useState, useEffect, useCallback } from 'react';
import type { AuditLog, AuditFilters, AuditStats } from '../types';
import { auditoriaService } from '../services/auditoriaService';
import toast from 'react-hot-toast';

export const useAudit = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [count, setCount] = useState(0);
    const [stats, setStats] = useState<AuditStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [filters, setFilters] = useState<AuditFilters>({
        page: 1,
        page_size: 20
    });

    const fetchLogs = useCallback(async (currentFilters: AuditFilters) => {
        setIsLoading(true);
        try {
            const data = await auditoriaService.getLogs(currentFilters);
            setLogs(data.results);
            setCount(data.count);
        } catch (error) {
            console.error('Error fetching logs:', error);
            toast.error('No se pudieron cargar los registros de auditoría');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchStats = async () => {
        setIsStatsLoading(true);
        try {
            const response = await auditoriaService.getStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setIsStatsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(filters);
    }, [filters, fetchLogs]);

    useEffect(() => {
        fetchStats();
    }, []);

    const handleFilterChange = (newFilters: Partial<AuditFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const exportData = async () => {
        try {
            toast.promise(auditoriaService.exportToCSV(filters), {
                loading: 'Generando reporte...',
                success: 'Reporte generado correctamente',
                error: 'Error al generar reporte'
            });
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    return {
        logs,
        count,
        stats,
        isLoading,
        isStatsLoading,
        filters,
        handleFilterChange,
        handlePageChange,
        exportData,
        refreshLogs: () => fetchLogs(filters)
    };
};
