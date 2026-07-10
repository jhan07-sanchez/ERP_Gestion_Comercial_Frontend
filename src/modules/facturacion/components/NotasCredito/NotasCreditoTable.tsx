import { Table, Button } from "@/shared/components/ui";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { FacturaStatusBadge } from "../FacturaStatusBadge";
import type { NotaCredito } from "../../types/notaCredito.types";
import { useNavigate } from "react-router-dom";

interface NotasCreditoTableProps {
  notas: NotaCredito[];
  isLoading: boolean;
}

export function NotasCreditoTable({ notas, isLoading }: NotasCreditoTableProps) {
  const navigate = useNavigate();

  if (isLoading && notas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4" />
        <p className="text-primary-600 font-medium">Cargando notas de crédito...</p>
      </div>
    );
  }

  if (notas.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <h3 className="text-lg font-bold text-primary-900 mb-1">Sin notas de crédito</h3>
        <p className="text-primary-600/60 text-sm">No se encontraron notas registradas.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-[120px]">Número</Table.Head>
            <Table.Head>Factura Origen</Table.Head>
            <Table.Head className="hidden md:table-cell">Fecha Emisión</Table.Head>
            <Table.Head className="hidden lg:table-cell">Motivo</Table.Head>
            <Table.Head className="text-right">Total</Table.Head>
            <Table.Head className="text-center">Estado</Table.Head>
            <Table.Head className="text-center w-[80px]">Acciones</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {notas.map((nota) => (
            <Table.Row key={nota.id} className="group hover:bg-primary-50/30 transition-colors">
              <Table.Cell className="font-mono text-xs font-semibold text-primary-600">
                {nota.numero || `#Borrador-${nota.id}`}
              </Table.Cell>
              <Table.Cell className="font-medium text-primary-800">
                {nota.factura_numero || `#${nota.factura}`}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell text-sm text-primary-600">
                {formatDate(nota.fecha_emision)}
              </Table.Cell>
              <Table.Cell className="hidden lg:table-cell text-sm text-gray-500 max-w-xs truncate">
                <span title={nota.motivo}>{nota.motivo}</span>
              </Table.Cell>
              <Table.Cell className="text-right font-black text-primary-900">
                {formatCurrency(nota.total)}
              </Table.Cell>
              <Table.Cell className="text-center">
                <FacturaStatusBadge estado={nota.estado} />
              </Table.Cell>
              <Table.Cell className="text-center">
                <Button
                  size="sm"
                  variant="secondary"
                  className="px-3 h-8"
                  onClick={() => navigate(`/facturacion/notas_credito/${nota.id}/detalle`, { relative: "route" })}
                >
                  Ver
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
