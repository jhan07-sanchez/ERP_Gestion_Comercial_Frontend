import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Table} from "@/shared/components/ui";
import { useCompras } from "../hooks/useCompras";
import type { CompraDetail } from "../types";
import {
  formatCurrency,
  formatNumber,
  numberClass,
  formatPercentage,
} from "@/shared/utils/formatters";


export default function CompraDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCompra } = useCompras();

  const [compra, setCompra] = useState<CompraDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadCompra = async () => {
      try {
        const data = await getCompra(Number(id));
        setCompra(data);
      } catch (err) {
        console.error(err);
        navigate("/compras");
      } finally {
        setLoading(false);
      }
    };

    loadCompra();
  }, [id, getCompra, navigate]);

  if (loading || !compra) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando compra...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate("/compras")}>
          ← Volver
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Detalle {compra.numero_compra}</h1>
          <p className="text-gray-600">Información completa de la compra</p>
        </div>
      </div>

      {/* Información general */}
      <Card>
        <Card.Content className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Proveedor</h3>
            <p>
              <strong>Nombre:</strong> {compra.proveedor_info.nombre}
            </p>
            <p>
              <strong>Documento:</strong> {compra.proveedor_info.documento}
            </p>
            <p>
              <strong>Teléfono:</strong> {compra.proveedor_info.telefono}
            </p>
            <p>
              <strong>Email:</strong> {compra.proveedor_info.email}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Información Compra</h3>
            <p>
              <strong>Fecha:</strong> {compra.fecha}
            </p>
            <p>
              <strong>Total: </strong>
              {""}
              <span className={numberClass}>
                {formatCurrency(compra.total)}
              </span>
            </p>
            <p>
              <strong>Total productos: </strong> {""}
              <span className={numberClass}>
                {formatNumber(compra.total_productos)}
              </span>
            </p>
            <p>
              <strong>Total unidades: </strong>
              {""}
              <span className={numberClass}>
                {formatNumber(compra.total_unidades)}
              </span>
            </p>
            <p>
              <strong>Registrado por:</strong> {compra.usuario_nombre}
            </p>
            <p>
              <strong>Email usuario:</strong> {compra.usuario_email}
            </p>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="space-y-2">
          <h3 className="font-semibold text-lg">Margen Potencial</h3>

          <p>
            <strong>Valor compra: </strong>
            <span className={numberClass}>
              {formatCurrency(compra.margen_potencial.valor_compra)}
            </span>
          </p>

          <p>
            <strong>Valor venta potencial: </strong>
            <span className={numberClass}>
              {formatCurrency(compra.margen_potencial.valor_venta_potencial)}
            </span>
          </p>

          <p className="text-green-600 font-semibold">
            <strong>Ganancia potencial: </strong>
            <span className={numberClass}>
              {formatCurrency(compra.margen_potencial.ganancia_potencial)}
            </span>
          </p>

          <p>
            <strong>Margen %: </strong>{" "}
            <span className={numberClass}>
              {formatPercentage(compra.margen_potencial.margen_porcentaje)}
            </span>
          </p>
        </Card.Content>
      </Card>

      {/* Productos */}
      <Card>
        <Card.Content>
          <h2 className="text-xl font-semibold mb-4">Productos</h2>

          <Table>
            <thead>
              <tr>
                <th className="text-center">Código</th>
                <th>Producto</th>
                <th className="text-center">Cantidad</th>
                <th className="text-center">Precio compra</th>
                <th className="text-center">Subtotal</th>
                <th className="text-center">Ganancia unitaria</th>
                <th className="text-center">Ganancia total</th>
                <th className="text-center">Margen %</th>
              </tr>
            </thead>

            <tbody>
              {compra.detalles.map((d) => (
                <tr key={d.id}>
                  <td className="font-mono text-center">{d.producto}</td>
                  <td className="text-center">{d.producto_nombre}</td>
                  <td className={`text-center ${formatNumber}`}>
                    {d.cantidad}
                  </td>
                  <td className={`text-center ${numberClass}`}>
                    {formatCurrency(d.precio_compra)}
                  </td>

                  <td className={`text-center ${numberClass}`}>
                    {formatCurrency(d.subtotal)}
                  </td>

                  <td className={`text-green-600 text-center ${numberClass}`}>
                    {formatCurrency(d.margen_potencial.ganancia_unitaria)}
                  </td>

                  <td
                    className={`text-green-600 font-semibold text-center ${numberClass}`}
                  >
                    {formatCurrency(d.margen_potencial.ganancia_total)}
                  </td>

                  <td className={`text-center ${numberClass}`}>
                    {formatPercentage(d.margen_potencial.margen_porcentaje)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Content>
      </Card>
    </div>
  );
}
