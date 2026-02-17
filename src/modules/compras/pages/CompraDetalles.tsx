import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Table} from "@/components/ui";
import { useCompras } from "../hooks/useCompras";
import type { CompraDetail } from "../types";

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
              <strong>Total:</strong> $
              {Number(compra.total).toLocaleString("es-CO")}
            </p>
            <p>
              <strong>Total productos:</strong> {compra.total_productos}
            </p>
            <p>
              <strong>Total unidades:</strong> {compra.total_unidades}
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
            <strong>Valor compra:</strong> $
            {compra.margen_potencial.valor_compra.toLocaleString("es-CO")}
          </p>

          <p>
            <strong>Valor venta potencial:</strong> $
            {compra.margen_potencial.valor_venta_potencial.toLocaleString(
              "es-CO",
            )}
          </p>

          <p className="text-green-600 font-semibold">
            <strong>Ganancia potencial:</strong> $
            {compra.margen_potencial.ganancia_potencial.toLocaleString("es-CO")}
          </p>

          <p>
            <strong>Margen %:</strong>{" "}
            {compra.margen_potencial.margen_porcentaje}%
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
                  <td className="font-mono text-center">{d.cantidad}</td>
                  <td className="font-mono text-center">
                    ${Number(d.precio_compra).toLocaleString("es-CO")}
                  </td>
                  <td className="font-mono text-center">
                    ${Number(d.subtotal).toLocaleString("es-CO")}
                  </td>

                  <td className="text-green-600 text-center font-mono">
                    $
                    {d.margen_potencial.ganancia_unitaria.toLocaleString(
                      "es-CO",
                    )}
                  </td>

                  <td className="text-green-600 font-semibold text-center font-mono">
                    ${d.margen_potencial.ganancia_total.toLocaleString("es-CO")}
                  </td>

                  <td className="text-center font-mono">
                    {d.margen_potencial.margen_porcentaje}%
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
