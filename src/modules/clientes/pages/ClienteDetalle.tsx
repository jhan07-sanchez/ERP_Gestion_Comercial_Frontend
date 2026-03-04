/**
 * 📄 PÁGINA: ClienteDetalle
 * Detalle completo de un cliente. Mismo patrón que VentaDetalle.tsx
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Badge } from "@/shared/components/ui";
import { useClientes } from "../hooks/useClientes";
import type { ClienteDetail, EstadoCliente } from "../types";
import { getTipoDocumentoLabel } from "../types";
import { useAlert } from "@/shared/components/alerts";

const estadoVariantMap: Record<
  EstadoCliente,
  "success" | "warning" | "danger"
> = {
  ACTIVO: "success",
  INACTIVO: "warning",
  BLOQUEADO: "danger",
};

export default function ClienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    getCliente,
    activarCliente,
    desactivarCliente,
    loadingActivar,
    loadingDesactivar,
  } = useClientes();
  const { showAlert, confirm } = useAlert();

  const [cliente, setCliente] = useState<ClienteDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Cargar cliente ───────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const loadCliente = async () => {
      try {
        const data = await getCliente(Number(id));
        setCliente(data);
      } catch (err) {
        console.error(err);
        navigate("/clientes");
      } finally {
        setLoading(false);
      }
    };

    loadCliente();
  }, [id, getCliente, navigate]);

  // ─── Activar cliente ──────────────────────────────────────────────────
  const handleActivar = async () => {
    if (!cliente) return;

    const confirmed = await confirm("Activar Cliente", `¿Deseas activar al cliente "${cliente.nombre}"?`, "info");

    if (!confirmed) return;

    const result = await activarCliente(cliente.id);

    if (result) {
      showAlert("Cliente Activado", "success", { description: `El cliente "${cliente.nombre}" ha sido activado.` });
      setCliente((prev) => (prev ? { ...prev, estado: "ACTIVO" } : prev));
    }
  };

  // ─── Desactivar cliente ───────────────────────────────────────────────
  const handleDesactivar = async () => {
    if (!cliente) return;

    const confirmed = await confirm("Desactivar Cliente", `¿Deseas desactivar al cliente "${cliente.nombre}"? No podrá realizar nuevas ventas mientras esté inactivo.`, "warning");

    if (!confirmed) return;

    const result = await desactivarCliente(cliente.id);

    if (result) {
      showAlert("Cliente Desactivado", "warning", { description: `El cliente "${cliente.nombre}" ha sido desactivado.` });
      setCliente((prev) => (prev ? { ...prev, estado: "INACTIVO" } : prev));
    }
  };

  // ─── Loading ──────────────────────────────────────────────────────────
  if (loading || !cliente) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate("/clientes")}>
            ← Volver
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Cliente #{cliente.id}
            </h1>

            <p className="text-gray-600 mt-1">
              Información completa del cliente
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          {cliente.estado === "INACTIVO" && (
            <Button
              variant="success"
              onClick={handleActivar}
              isLoading={loadingActivar}
            >
              Activar Cliente
            </Button>
          )}

          {cliente.estado === "ACTIVO" && (
            <Button
              variant="danger"
              onClick={handleDesactivar}
              isLoading={loadingDesactivar}
            >
              Desactivar Cliente
            </Button>
          )}

          <Button onClick={() => navigate(`/clientes/${cliente.id}/editar`)}>
            Editar
          </Button>
        </div>
      </div>

      {/* ── Información general ───────────────────────────────────── */}
      <Card>
        <Card.Header>
          <Card.Title>Información del Cliente</Card.Title>
        </Card.Header>

        <Card.Content className="space-y-3">
          <p>
            <strong>Nombre:</strong> {cliente.nombre}
          </p>

          <p>
            <strong>Tipo documento:</strong> {getTipoDocumentoLabel(cliente.tipo_documento)}
          </p>

          <p>
            <strong>Número documento:</strong> {cliente.numero_documento}
          </p>

          {cliente.telefono && (
            <p>
              <strong>Teléfono:</strong> {cliente.telefono}
            </p>
          )}

          {cliente.email && (
            <p>
              <strong>Email:</strong> {cliente.email}
            </p>
          )}

          {cliente.direccion && (
            <p>
              <strong>Dirección:</strong> {cliente.direccion}
            </p>
          )}

          <p>
            <strong>Estado:</strong>{" "}
            <Badge variant={estadoVariantMap[cliente.estado]}>
              {cliente.estado}
            </Badge>
          </p>

          <p>
            <strong>Fecha creación:</strong>{" "}
            {cliente.fecha_creacion
              ? new Date(cliente.fecha_creacion).toLocaleDateString("es-CO")
              : "Sin fecha"}
          </p>

          <p>
            <strong>Última actualización:</strong>{" "}
            {cliente.fecha_actualizacion
              ? new Date(cliente.fecha_actualizacion).toLocaleDateString(
                "es-CO",
              )
              : "Sin fecha"}
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
