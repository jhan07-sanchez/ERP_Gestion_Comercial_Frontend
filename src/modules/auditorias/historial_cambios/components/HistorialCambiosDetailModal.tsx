/**
 * Modal de detalle de un log.
 */

import { Modal } from '@/components/Modal';
import { Badge } from '@/components/ui';
import type { LogAuditoriaDetail } from '../types';

interface HistorialCambiosDetailModalProps {
  log: LogAuditoriaDetail | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-CO', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });
  } catch {
    return iso;
  }
}

export function HistorialCambiosDetailModal({
  log,
  isOpen,
  onClose,
  isLoading = false,
}: HistorialCambiosDetailModalProps) {
  if (!isOpen) return null;

  if (isLoading || !log) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Detalle del log">
        <div className="py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          <p className="mt-3 text-sm text-gray-600">
            {isLoading ? 'Cargando...' : 'No se pudo cargar el detalle'}
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Log #${log.id}`}>
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-600">Fecha y hora</span>
            <p className="mt-1">{formatDateTime(log.fecha_hora)}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Usuario</span>
            <p className="mt-1">{log.usuario_nombre || log.usuario_info?.nombre || 'Sistema'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Módulo</span>
            <p className="mt-1">{log.modulo_display}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Acción</span>
            <p className="mt-1">{log.icono} {log.accion_display}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Nivel</span>
            <p className="mt-1">
              <Badge variant={log.nivel === 'ERROR' || log.nivel === 'CRITICAL' ? 'danger' : 'info'}>
                {log.nivel_display}
              </Badge>
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Estado</span>
            <p className="mt-1">
              <Badge variant={log.exitoso ? 'success' : 'danger'}>{log.exitoso ? 'Exitoso' : 'Fallido'}</Badge>
            </p>
          </div>
          {log.ip_address && (
            <div>
              <span className="font-medium text-gray-600">IP</span>
              <p className="mt-1 font-mono">{log.ip_address}</p>
            </div>
          )}
          {log.endpoint && (
            <div>
              <span className="font-medium text-gray-600">Endpoint</span>
              <p className="mt-1 font-mono text-xs break-all">{log.endpoint}</p>
            </div>
          )}
        </div>
        <div>
          <span className="font-medium text-gray-600">Descripción</span>
          <p className="mt-1 p-3 bg-gray-50 rounded-lg">{log.descripcion}</p>
        </div>
        {log.objeto_repr && (
          <div>
            <span className="font-medium text-gray-600">Objeto afectado</span>
            <p className="mt-1">{log.objeto_repr}</p>
          </div>
        )}
        {log.tiene_cambios && (log.datos_antes || log.datos_despues) && (
          <div className="grid grid-cols-2 gap-4">
            {log.datos_antes && (
              <div>
                <span className="font-medium text-gray-600">Datos anteriores</span>
                <pre className="mt-1 p-3 bg-gray-50 rounded-lg text-xs overflow-auto max-h-40">
                  {JSON.stringify(log.datos_antes, null, 2)}
                </pre>
              </div>
            )}
            {log.datos_despues && (
              <div>
                <span className="font-medium text-gray-600">Datos nuevos</span>
                <pre className="mt-1 p-3 bg-gray-50 rounded-lg text-xs overflow-auto max-h-40">
                  {JSON.stringify(log.datos_despues, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
