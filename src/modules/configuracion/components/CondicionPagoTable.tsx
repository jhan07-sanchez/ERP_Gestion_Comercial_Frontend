import { Button, Card, Table, Badge } from '@/shared/components/ui';
import type { CondicionPago } from '@/modules/configuracion/types/configuracion.types';
import { IconEdit, IconPower, IconClock } from '@tabler/icons-react';
import { CondicionesPagoEmptyState } from './CondicionesPago/CondicionesPagoEmptyState';

interface CondicionPagoTableProps {
  condiciones: CondicionPago[];
  isLoading: boolean;
  onToggleActivo: (id: number, activo: boolean) => void;
  onEdit: (condicion: CondicionPago) => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
  onNewClick?: () => void;
}

export function CondicionPagoTable({ 
    condiciones, 
    isLoading, 
    onToggleActivo, 
    onEdit,
    isFiltered,
    onClearFilters,
    onNewClick
}: CondicionPagoTableProps) {
  
  if (isLoading) {
    return (
      <Card className="shadow-sm border-primary-100 overflow-hidden">
        <Card.Content className="p-12 flex justify-center text-primary-500">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                <p className="font-medium">Cargando condiciones de pago...</p>
            </div>
        </Card.Content>
      </Card>
    );
  }

  if (condiciones.length === 0) {
      return (
          <CondicionesPagoEmptyState 
              isSearchEmpty={isFiltered} 
              onClearSearch={onClearFilters}
              onNewClick={onNewClick}
          />
      );
  }

  return (
    <Card className="shadow-sm border-primary-100 overflow-hidden transition-all">
      <Card.Content className="p-0">
        <Table>
          <Table.Header className="bg-primary-50/50">
            <Table.Row>
              <Table.Head className="font-semibold text-primary-700 py-4">Nombre de la Condición</Table.Head>
              <Table.Head className="w-[150px] font-semibold text-primary-700 py-4 text-center">Días de Plazo</Table.Head>
              <Table.Head className="w-[150px] font-semibold text-primary-700 py-4">Estado</Table.Head>
              <Table.Head className="text-right w-[150px] font-semibold text-primary-700 py-4 pr-6">Acciones</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {condiciones.map((condicion) => (
              <Table.Row 
                key={condicion.id} 
                className="hover:bg-primary-50/60 transition-colors group"
              >
                <Table.Cell className="py-4">
                    <span className="font-medium text-primary-900">{condicion.nombre}</span>
                </Table.Cell>
                <Table.Cell className="py-4 text-center">
                    <Badge variant="gray" size="sm" className="inline-flex items-center gap-1.5 font-medium">
                        <IconClock size={14} />
                        {condicion.dias_plazo} {condicion.dias_plazo === 1 ? 'día' : 'días'}
                    </Badge>
                </Table.Cell>
                <Table.Cell className="py-4">
                    <Badge 
                        variant={condicion.activo ? 'success' : 'danger'} 
                        dot
                    >
                        {condicion.activo ? 'Activa' : 'Inactiva'}
                    </Badge>
                </Table.Cell>
                <Table.Cell className="text-right py-4 pr-6">
                  <div className="inline-flex items-center justify-end gap-2">
                    <Button 
                        size="sm" 
                        variant="primary" 
                        onClick={() => onEdit(condicion)}
                        title="Editar condición"
                        leftIcon={<IconEdit size={16} />}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant={condicion.activo ? 'danger' : 'success'}
                      onClick={() => onToggleActivo(condicion.id, !condicion.activo)}
                      title={condicion.activo ? 'Desactivar condición' : 'Activar condición'}
                      leftIcon={<IconPower size={16} />}
                    >
                      {condicion.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  );
}
