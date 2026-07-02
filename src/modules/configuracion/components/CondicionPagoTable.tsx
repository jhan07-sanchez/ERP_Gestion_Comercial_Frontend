import { Button, Card, Table } from '@/shared/components/ui';
import type { CondicionPago } from '@/modules/configuracion/types/configuracion.types';

interface CondicionPagoTableProps {
  condiciones: CondicionPago[];
  isLoading: boolean;
  onToggleActivo: (id: number, activo: boolean) => void;
  onEdit: (condicion: CondicionPago) => void;
}

export function CondicionPagoTable({ condiciones, isLoading, onToggleActivo, onEdit }: CondicionPagoTableProps) {
  return (
    <Card className="shadow-sm border-primary-100 overflow-hidden">
      <Card.Content className="p-0">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Nombre</Table.Head>
              <Table.Head className="w-[120px]">Días</Table.Head>
              <Table.Head className="w-[120px]">Estado</Table.Head>
              <Table.Head className="text-right w-[180px]">Acciones</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row className="bg-primary-50">
                <Table.Cell colSpan={4} className="text-center text-primary-500 py-8">
                  Cargando...
                </Table.Cell>
              </Table.Row>
            ) : condiciones.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={4} className="text-center text-primary-500 py-8">
                  No hay condiciones de pago registradas.
                </Table.Cell>
              </Table.Row>
            ) : (
              condiciones.map((condicion) => (
                <Table.Row key={condicion.id} className="hover:bg-primary-50/60">
                  <Table.Cell>{condicion.nombre}</Table.Cell>
                  <Table.Cell>{condicion.dias_plazo}</Table.Cell>
                  <Table.Cell>{condicion.activo ? 'Activa' : 'Inactiva'}</Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(condicion)}>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant={condicion.activo ? 'secondary' : 'success'}
                        onClick={() => onToggleActivo(condicion.id, !condicion.activo)}
                      >
                        {condicion.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  );
}
