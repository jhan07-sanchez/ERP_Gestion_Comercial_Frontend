/**
 * Listado de historial de cambios.
 */

import { useState, useCallback } from 'react';
import { Card, Button } from '@/components/ui';
import { useHistorialCambiosList } from '../hooks/useHistorialCambiosList';
import { historialCambiosAPI } from '../api';
import type { LogAuditoria, LogAuditoriaDetail } from '../types';
import {
  HistorialCambiosTable,
  HistorialCambiosFilters,
  HistorialCambiosEmptyState,
  HistorialCambiosPagination,
  HistorialCambiosDetailModal,
} from '../components';

export default function HistorialCambiosList() {
  const {
    logs,
    isLoading,
    error,
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    filters,
    hasFetched,
    applyFilters,
    changePage,
    changePageSize,
    retry,
  } = useHistorialCambiosList();

  const [detailLog, setDetailLog] = useState<LogAuditoriaDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = useCallback(async (log: LogAuditoria) => {
    setIsModalOpen(true);
    setDetailLog(null);
    setIsDetailLoading(true);
    try {
      const detail = await historialCambiosAPI.getLogDetail(log.id);
      setDetailLog(detail);
    } catch {
      setDetailLog(null);
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const handleClearFilters = useCallback(() => applyFilters({}), [applyFilters]);

  if (!hasFetched && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          <p className="mt-4 text-gray-600">Cargando historial de cambios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Historial de cambios</h1>
        <Card>
          <Card.Content>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={retry}>Reintentar</Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Historial de cambios</h1>
        <p className="text-gray-600 mt-1">Registro de actividades y eventos del sistema</p>
      </div>

      <HistorialCambiosFilters
        filters={filters}
        onApply={applyFilters}
        onReset={handleClearFilters}
        isLoading={isLoading}
      />

      {logs.length === 0 && !isLoading ? (
        <HistorialCambiosEmptyState
          hasFilters={Object.keys(filters).length > 0}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <Card>
          <Card.Content className="p-0 overflow-hidden">
            <HistorialCambiosTable
              logs={logs}
              onRowClick={handleRowClick}
              isLoading={isLoading}
            />
            <HistorialCambiosPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={changePage}
              onPageSizeChange={changePageSize}
              isLoading={isLoading}
            />
          </Card.Content>
        </Card>
      )}

      <HistorialCambiosDetailModal
        log={detailLog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isDetailLoading}
      />
    </div>
  );
}
