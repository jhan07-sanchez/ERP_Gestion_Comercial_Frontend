/**
 * 📄 PÁGINA: VentaDetalle
 * Detalle completo de una venta. Mismo patrón que CompraDetalles.tsx
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Table, Badge } from "@/components/ui";
import { useVentas } from "../hooks/useVenta";
import { formatCurrency, formatNumber, numberClass } from "@/utils/formatters";
import type { VentaDetail, EstadoVenta } from "../types/venta.types";

const estadoVariantMap: Record<EstadoVenta, "success" | "warning" | "danger"> =
  {
    COMPLETADA: "success",
    PENDIENTE: "warning",
    CANCELADA: "danger",
  };

export default function VentaDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getVenta,
    completarVenta,
    cancelarVenta,
    loadingCompletar,
    loadingCancelar,
  } = useVentas();

  const [venta, setVenta] = useState<VentaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Cargar venta ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const loadVenta = async () => {
      try {
        const data = await getVenta(Number(id));
        setVenta(data);
      } catch (err) {
        console.error(err);
        navigate("/ventas");
      } finally {
        setLoading(false);
      }
    };

    loadVenta();
  }, [id, getVenta, navigate]);

  // ─── Completar ─────────────────────────────────────────────────────────
  const handleCompletar = async () => {
    if (!venta) return;
    const confirm = window.confirm(
      "¿Confirmar esta venta? Se descontará el stock de los productos.",
    );
    if (!confirm) return;

    const result = await completarVenta(venta.id);
    if (result)
      setVenta((prev) => (prev ? { ...prev, estado: "COMPLETADA" } : prev));
  };

  // ─── Cancelar ──────────────────────────────────────────────────────────
  const handleCancelar = async () => {
    if (!venta) return;
    const motivo = window.prompt("Motivo de la cancelación:");
    if (!motivo) {
      alert("Debes ingresar un motivo.");
      return;
    }

    const result = await cancelarVenta(venta.id, motivo);
    if (result)
      setVenta((prev) => (prev ? { ...prev, estado: "CANCELADA" } : prev));
  };

  // ─── Loading ───────────────────────────────────────────────────────────
  if (loading || !venta) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando venta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate("/ventas")}>
            ← Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Venta #{venta.id}
            </h1>
            <p className="text-gray-600 mt-1">
              Información completa de la venta
            </p>
          </div>
        </div>

        {/* Acciones contextuales */}
        <div className="flex gap-2">
          {venta.estado === "PENDIENTE" && (
            <>
              <Button onClick={() => navigate(`/ventas/${venta.id}/editar`)}>
                Editar
              </Button>
              <Button
                variant="success"
                onClick={handleCompletar}
                isLoading={loadingCompletar}
              >
                Completar Venta
              </Button>
            </>
          )}

          {venta.estado !== "CANCELADA" && (
            <Button
              variant="danger"
              onClick={handleCancelar}
              isLoading={loadingCancelar}
            >
              Cancelar Venta
            </Button>
          )}
        </div>
      </div>

      {/* ── Info general ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cliente */}
        <Card>
          <Card.Header>
            <Card.Title>Información del Cliente</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-2">
            <p>
              <strong>Nombre:</strong> {venta.cliente_info.nombre}
            </p>
            <p>
              <strong>Documento:</strong> {venta.cliente_info.documento}
            </p>
            {venta.cliente_info.telefono && (
              <p>
                <strong>Teléfono:</strong> {venta.cliente_info.telefono}
              </p>
            )}
            {venta.cliente_info.email && (
              <p>
                <strong>Email:</strong> {venta.cliente_info.email}
              </p>
            )}
          </Card.Content>
        </Card>

        {/* Venta */}
        <Card>
          <Card.Header>
            <Card.Title>Información de la Venta</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-2">
            <p>
              <strong>Estado: </strong>
              <Badge variant={estadoVariantMap[venta.estado]}>
                {venta.estado}
              </Badge>
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(venta.fecha).toLocaleDateString("es-CO")}
            </p>
            <p>
              <strong>Total: </strong>
              <span className={numberClass}>{formatCurrency(venta.total)}</span>
            </p>
            <p>
              <strong>Total productos: </strong>
              <span className={numberClass}>
                {formatNumber(venta.total_productos)}
              </span>
            </p>
            <p>
              <strong>Total unidades: </strong>
              <span className={numberClass}>
                {formatNumber(venta.total_unidades)}
              </span>
            </p>
            <p>
              <strong>Registrado por:</strong> {venta.usuario_nombre}
            </p>
            <p>
              <strong>Email usuario:</strong> {venta.usuario_email}
            </p>
          </Card.Content>
        </Card>
      </div>

      {/* ── Productos ─────────────────────────────────────────────────── */}
      <Card>
        <Card.Header>
          <Card.Title>Productos de la Venta</Card.Title>
        </Card.Header>
        <Card.Content>
          <Table>
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Código
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Producto
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">
                  Cantidad
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">
                  Precio Unit.
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles.map((d) => (
                <tr key={d.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm text-gray-600">
                    {d.producto_codigo}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {d.producto_nombre}
                  </td>
                  <td className={`py-3 px-4 text-center ${numberClass}`}>
                    {formatNumber(d.cantidad)}
                  </td>
                  <td className={`py-3 px-4 text-right ${numberClass}`}>
                    {formatCurrency(d.precio_unitario)}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-semibold text-green-600 ${numberClass}`}
                  >
                    {formatCurrency(d.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Total al pie */}
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td
                  colSpan={4}
                  className="py-3 px-4 text-right font-bold text-gray-900"
                >
                  TOTAL
                </td>
                <td
                  className={`py-3 px-4 text-right font-bold text-xl text-gray-900 ${numberClass}`}
                >
                  {formatCurrency(venta.total)}
                </td>
              </tr>
            </tfoot>
          </Table>
        </Card.Content>
      </Card>
    </div>
  );
}
