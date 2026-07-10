import { useState } from "react";
import { Card, Input, Button, Table } from "@/shared/components/ui";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import type { NotaDebitoCreate, NotaDebitoDetalleCreate } from "../../types/notaDebito.types";
import { BuscadorFacturas } from "../Shared/BuscadorFacturas";

interface NotaDebitoFormProps {
  onSubmit: (data: NotaDebitoCreate) => void;
  onCancel: () => void;
  submitting: boolean;
}

export function NotaDebitoForm({ onSubmit, onCancel, submitting }: NotaDebitoFormProps) {
  const [facturaId, setFacturaId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState("");
  const [detalles, setDetalles] = useState<NotaDebitoDetalleCreate[]>([
    { producto_nombre: "", cantidad: 1, precio_unitario: 0, descuento: 0, impuestos_linea: 0 }
  ]);

  const handleAddDetalle = () => {
    setDetalles([...detalles, { producto_nombre: "", cantidad: 1, precio_unitario: 0, descuento: 0, impuestos_linea: 0 }]);
  };

  const handleRemoveDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const handleDetalleChange = (index: number, field: keyof NotaDebitoDetalleCreate, value: string | number) => {
    const newDetalles = [...detalles];
    newDetalles[index] = { ...newDetalles[index], [field]: value };
    setDetalles(newDetalles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facturaId || !motivo || detalles.length === 0) return;
    
    // Preparar detalles asegurando números
    const detallesProcesados = detalles.map(d => ({
      ...d,
      cantidad: Number(d.cantidad),
      precio_unitario: Number(d.precio_unitario),
      descuento: Number(d.descuento || 0),
      impuestos_linea: Number(d.impuestos_linea || 0)
    }));

    onSubmit({
      factura_id: facturaId,
      motivo,
      detalles: detallesProcesados,
    });
  };

  const totales = detalles.reduce(
    (acc, det) => {
      const cant = Number(det.cantidad) || 0;
      const prec = Number(det.precio_unitario) || 0;
      const desc = Number(det.descuento) || 0;
      const imp = Number(det.impuestos_linea) || 0;
      const subtotal = cant * prec;
      const tot = subtotal - desc + imp;
      
      return {
        subtotal: acc.subtotal + subtotal,
        descuentos: acc.descuentos + desc,
        impuestos: acc.impuestos + imp,
        total: acc.total + tot,
      };
    },
    { subtotal: 0, descuentos: 0, impuestos: 0, total: 0 }
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-bold text-primary-900">Información General</h3>
        </Card.Header>
        <Card.Content className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Buscar Factura Origen *</label>
            <BuscadorFacturas 
              onSelect={(id) => setFacturaId(id)} 
              onClear={() => setFacturaId(null)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Motivo de la Nota de Débito *</label>
            <Input
              required
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej. Intereses por mora, Gastos de cobranza"
            />
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-primary-900">Detalles de Cargos</h3>
          <Button type="button" size="sm" variant="secondary" onClick={handleAddDetalle}>
            <IconPlus size={16} className="mr-1" /> Agregar Cargo
          </Button>
        </Card.Header>
        <Card.Content className="p-0 overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Concepto / Cargo</Table.Head>
                <Table.Head className="w-24 text-center">Cantidad</Table.Head>
                <Table.Head className="w-32 text-right">Precio Unit.</Table.Head>
                <Table.Head className="w-32 text-right">Dcto</Table.Head>
                <Table.Head className="w-32 text-right">Impuestos</Table.Head>
                <Table.Head className="w-32 text-right">Total Linea</Table.Head>
                <Table.Head className="w-16">&nbsp;</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {detalles.map((detalle, idx) => {
                const subtotal = (Number(detalle.cantidad) || 0) * (Number(detalle.precio_unitario) || 0);
                const totalLinea = subtotal - (Number(detalle.descuento) || 0) + (Number(detalle.impuestos_linea) || 0);
                
                return (
                  <Table.Row key={idx}>
                    <Table.Cell>
                      <Input
                        required
                        value={detalle.producto_nombre}
                        onChange={(e) => handleDetalleChange(idx, "producto_nombre", e.target.value)}
                        placeholder="Descripción del cargo"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        value={detalle.cantidad}
                        onChange={(e) => handleDetalleChange(idx, "cantidad", Number(e.target.value))}
                        className="text-center"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={detalle.precio_unitario}
                        onChange={(e) => handleDetalleChange(idx, "precio_unitario", Number(e.target.value))}
                        className="text-right"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={detalle.descuento}
                        onChange={(e) => handleDetalleChange(idx, "descuento", Number(e.target.value))}
                        className="text-right text-danger-600"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={detalle.impuestos_linea}
                        onChange={(e) => handleDetalleChange(idx, "impuestos_linea", Number(e.target.value))}
                        className="text-right text-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="text-right font-bold text-gray-700">
                      $ {totalLinea.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      {detalles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDetalle(idx)}
                          className="text-danger-500 hover:text-danger-700 p-1 rounded-full hover:bg-danger-50"
                        >
                          <IconTrash size={18} />
                        </button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="flex justify-end pt-4 pb-4">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${totales.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-danger-600">
              <span>Descuentos:</span>
              <span>-${totales.descuentos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Impuestos:</span>
              <span>${totales.impuestos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-primary-900 border-t border-gray-200 pt-2">
              <span>Total ND:</span>
              <span>${totales.total.toFixed(2)}</span>
            </div>
          </div>
        </Card.Content>
      </Card>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting || detalles.length === 0 || !facturaId}>
          {submitting ? "Guardando..." : "Crear Borrador"}
        </Button>
      </div>
    </form>
  );
}
