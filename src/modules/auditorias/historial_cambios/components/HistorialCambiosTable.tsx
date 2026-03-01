/**
 * Tabla de logs de historial de cambios.
 */

import { Table, Badge } from '@/components/ui';
import type { LogAuditoria } from '../types';

interface HistorialCambiosTableProps {
  logs: LogAuditoria[];
  onRowClick?: (log: LogAuditoria) => void;
  isLoading?: boolean;
}

const nivelVariantMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'gray'> = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'danger',
  CRITICAL: 'danger',
};

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  } catch {
    return iso;
  }
}

export function HistorialCambiosTable({
  logs,
  onRowClick,
  isLoading = false,
}: HistorialCambiosTableProps) {
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        <p className="mt-3 text-sm text-gray-600">Cargando logs...</p>
      </div>
    );
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Fecha</Table.Head>
          <Table.Head>Usuario</Table.Head>
          <Table.Head>Módulo</Table.Head>
          <Table.Head>Acción</Table.Head>
          <Table.Head>Nivel</Table.Head>
          <Table.Head>Descripción</Table.Head>
          <Table.Head className="text-center">Estado</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {logs.map((log) => (
          <Table.Row
            key={log.id}
            hover
            onClick={() => onRowClick?.(log)}
            className={onRowClick ? 'cursor-pointer' : ''}
          >
            <Table.Cell className="text-gray-600 text-sm whitespace-nowrap">
              {formatDateTime(log.fecha_hora)}
            </Table.Cell>
            <Table.Cell className="font-medium">
              {log.usuario_nombre || log.usuario_info?.nombre || 'Sistema'}
            </Table.Cell>
            <Table.Cell>{log.modulo_display}</Table.Cell>
            <Table.Cell>
              <span title={log.accion_display}>
                {log.icono} {log.accion_display}
              </span>
            </Table.Cell>
            <Table.Cell>
              <Badge variant={nivelVariantMap[log.nivel] ?? 'gray'} size="sm">
                {log.nivel_display}
              </Badge>
            </Table.Cell>
            <Table.Cell className="max-w-[300px] truncate" title={log.descripcion}>
              {log.descripcion}
            </Table.Cell>
            <Table.Cell className="text-center">
              <Badge variant={log.exitoso ? 'success' : 'danger'} size="sm">
                {log.exitoso ? 'OK' : 'Error'}
              </Badge>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
