import { useState, useEffect } from "react";
import { Card, Input, Button, Table } from "@/shared/components/ui";
import { IconTrash } from "@tabler/icons-react";
import type { NotaCreditoCreate, NotaCreditoDetalleCreate } from "../../types/notaCredito.types";
import { BuscadorFacturas } from "../Shared/BuscadorFacturas";
import { facturasVentaAPI } from "../../api";
import type { FacturaDetail } from "../../types";

interface NotaCreditoFormProps {
  onSubmit: (data: NotaCreditoCreate) => void;
  onCancel: () => void;
  submitting: boolean;
}

export function NotaCreditoForm({ onSubmit, onCancel, submitting }: NotaCreditoFormProps) {
  const [facturaId, setFacturaId] = useState<number | null>(null);
  const [facturaDetail, setFacturaDetail] = useState<FacturaDetail | null>(null);
  const [motivo, setMotivo] = useState("");
  const [lineasDevolucion, setLineasDevolucion] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const loadFacturaDetail = async () => {
      if (facturaId) {
        try {
          const data = await facturasVentaAPI.getFacturaById(facturaId);
          const initialLines: { [key: number]: number } = {};
          data.detalles.forEach((det) => {
            initialLines[det.id] = Number(det.cantidad);
          });
          setFacturaDetail(data);
          setLineasDevolucion(initialLines);
        } catch (err) {
          console.error("Error loading invoice details", err);
        }
      } else {
        setFacturaDetail(null);
        setLineasDevolucion({});
      }
    };

    loadFacturaDetail();
  }, [facturaId]);

  const handleCantidadChange = (lineId: number, cant: number, max: number) => {
    let newCant = cant;
    if (newCant < 0) newCant = 0;
    if (newCant > max) newCant = max;
    setLineasDevolucion({ ...lineasDevolucion, [lineId]: newCant });
  };

  const handleRemoveLine = (lineId: number) => {
    setLineasDevolucion({ ...lineasDevolucion, [lineId]: 0 });
  };

  const calcularProporcionales = () => {
    if (!facturaDetail) return { detalles: [], subtotal: 0, descuentos: 0, impuestos: 0, total: 0 };
    
    let subtotal_nc = 0;
    let descuentos_nc = 0;
    let impuestos_nc = 0;
    let total_nc = 0;
    const detalles_nc: NotaCreditoDetalleCreate[] = [];

    facturaDetail.detalles.forEach((det) => {
      const cant_devuelta = Number(lineasDevolucion[det.id]) || 0;
      if (cant_devuelta > 0) {
        const cantOriginal = Number(det.cantidad) || 1;
        const precioUnit = Number(det.precio_unitario) || 0;
        const descuentoDet = Number(det.descuento) || 0;
        const impuestosDet = Number(det.impuestos_linea) || 0;

        const ratio = cant_devuelta / cantOriginal;
        const subtotal = cant_devuelta * precioUnit;
        const desc = descuentoDet * ratio;
        const imp = impuestosDet * ratio;
        const tot = subtotal - desc + imp;

        subtotal_nc += subtotal;
        descuentos_nc += desc;
        impuestos_nc += imp;
        total_nc += tot;

        detalles_nc.push({
          producto_id: det.producto,
          producto_nombre: det.producto_nombre,
          producto_codigo: det.producto_codigo,
          cantidad: parseFloat(cant_devuelta.toFixed(2)),
          precio_unitario: parseFloat(precioUnit.toFixed(2)),
          descuento: parseFloat(desc.toFixed(2)),
          impuestos_linea: parseFloat(imp.toFixed(2)),
        });
      }
    });

    return { detalles: detalles_nc, subtotal: subtotal_nc, descuentos: descuentos_nc, impuestos: impuestos_nc, total: total_nc };
  };

  const { detalles, subtotal, descuentos, impuestos, total } = calcularProporcionales();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facturaId || !motivo || detalles.length === 0) return;
    onSubmit({
      factura_id: facturaId,
      motivo,
      detalles,
    });
  };

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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Motivo de la Nota de Crédito *</label>
            <Input
              required
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej. Devolución de mercancía dañada"
              disabled={!facturaId}
            />
          </div>
        </Card.Content>
      </Card>

      {facturaDetail && (
        <>
          <Card>
            <Card.Header className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-primary-900">Productos a Devolver</h3>
            </Card.Header>
            <Card.Content className="p-0 overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Producto</Table.Head>
                    <Table.Head className="w-32 text-center">Cant. Original</Table.Head>
                    <Table.Head className="w-32 text-center">A Devolver</Table.Head>
                    <Table.Head className="w-32 text-right">Precio Unit.</Table.Head>
                    <Table.Head className="w-32 text-right">Dcto</Table.Head>
                    <Table.Head className="w-32 text-right">Impuestos</Table.Head>
                    <Table.Head className="w-32 text-right">Total Linea</Table.Head>
                    <Table.Head className="w-16">&nbsp;</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {facturaDetail.detalles.map((det) => {
                    const cant_devuelta = Number(lineasDevolucion[det.id]) || 0;
                    const cantOriginal = Number(det.cantidad) || 1;
                    const precioUnit = Number(det.precio_unitario) || 0;
                    const descuentoDet = Number(det.descuento) || 0;
                    const impuestosDet = Number(det.impuestos_linea) || 0;

                    const ratio = cant_devuelta / cantOriginal;
                    const subtotal_linea = cant_devuelta * precioUnit;
                    const desc = descuentoDet * ratio;
                    const imp = impuestosDet * ratio;
                    const tot = subtotal_linea - desc + imp;
                    
                    return (
                      <Table.Row key={det.id} className={cant_devuelta === 0 ? "opacity-50" : ""}>
                        <Table.Cell>
                          <div className="font-medium text-gray-900">{det.producto_nombre}</div>
                          <div className="text-xs text-gray-500 font-mono">{det.producto_codigo}</div>
                        </Table.Cell>
                        <Table.Cell className="text-center">{det.cantidad}</Table.Cell>
                        <Table.Cell>
                          <Input
                            type="number"
                            min="0"
                            max={det.cantidad}
                            step="0.01"
                            value={cant_devuelta}
                            onChange={(e) => handleCantidadChange(det.id, Number(e.target.value), det.cantidad)}
                            className="text-center"
                          />
                        </Table.Cell>
                        <Table.Cell className="text-right">${det.precio_unitario}</Table.Cell>
                        <Table.Cell className="text-right text-danger-600">${desc.toFixed(2)}</Table.Cell>
                        <Table.Cell className="text-right text-gray-500">${imp.toFixed(2)}</Table.Cell>
                        <Table.Cell className="text-right font-bold text-gray-700">
                          ${tot.toFixed(2)}
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          {cant_devuelta > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLine(det.id)}
                              className="text-danger-500 hover:text-danger-700 p-1 rounded-full hover:bg-danger-50"
                              title="No devolver este producto"
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-danger-600">
                  <span>Descuentos:</span>
                  <span>-${descuentos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Impuestos:</span>
                  <span>${impuestos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary-900 border-t border-gray-200 pt-2">
                  <span>Total NC:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting || detalles.length === 0}>
          {submitting ? "Guardando..." : "Crear Borrador NC"}
        </Button>
      </div>
    </form>
  );
}
