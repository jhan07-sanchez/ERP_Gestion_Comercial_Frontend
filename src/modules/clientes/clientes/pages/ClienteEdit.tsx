/**
 * 📄 PÁGINA: ClienteEdit
 * Editar cliente existente. Mismo patrón que VentaEdit.tsx
 *
 * FLUJO:
 * 1. Carga cliente por ID
 * 2. Mapea datos → ClienteFormData (UI)
 * 3. Usuario edita
 * 4. Convierte UI → payload backend
 * 5. Actualiza → recarga → redirige
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui";
import { ClienteForm } from "../components/ClienteForm";
import { useClientes } from "../hooks/useClientes";
import type { ClienteFormData, ClienteUpdateInput } from "../types";
import { useAlert } from "@/components/alerts";

export default function ClienteEdit() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { getCliente, updateCliente, fetchClientes, error } = useClientes();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ClienteFormData | null>(null);

  // ─── Cargar cliente ───────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const loadCliente = async () => {
      try {
        const cliente = await getCliente(Number(id));

        console.log("📦 Cliente recibido para editar:", cliente);

        // Mapear backend → UI
        const mapped: ClienteFormData = {
          nombre: cliente.nombre,

          tipo_documento: cliente.tipo_documento,

          numero_documento: cliente.numero_documento,

          telefono: cliente.telefono ?? "",

          email: cliente.email ?? "",

          direccion: cliente.direccion ?? "",

          estado: cliente.estado,
        };

        setFormData(mapped);
      } catch (err) {
        console.error("❌ Error cargando cliente:", err);
        showAlert("Error", "error", { description: "Error al cargar el cliente. Volviendo al listado..." });
        navigate("/clientes");
      } finally {
        setLoading(false);
      }
    };

    loadCliente();
  }, [id, getCliente, navigate, showAlert]);

  // ─── Convertir UI → payload backend ───────────────────────────────
  const convertToAPIFormat = (data: ClienteFormData): ClienteUpdateInput => ({
    nombre: data.nombre,

    tipo_documento: data.tipo_documento,

    numero_documento: data.numero_documento,

    telefono: data.telefono || undefined,

    email: data.email || undefined,

    direccion: data.direccion || undefined,

    estado: data.estado,
  });

  // ─── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!id || !formData) return;

    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(formData);

      console.log("📡 Payload actualización cliente:", apiData);

      const success = await updateCliente(Number(id), apiData);

      if (success) {
        console.log("✅ Cliente actualizado");
        await fetchClientes();
        showAlert("¡Cliente Actualizado!", "success", { description: "Los datos del cliente se han actualizado correctamente." });
        navigate("/clientes");
      } else {
        throw new Error(error || "Error desconocido al actualizar");
      }
    } catch (err) {
      console.error("❌ Error actualizando cliente:", err);
      showAlert("Error", "error", {
        description: "Error al actualizar el cliente. Revisa los datos e intenta de nuevo."
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Cancelar ─────────────────────────────────────────────────────
  const handleCancel = () => {
    if (submitting) return;

    navigate("/clientes");
  };

  // ─── Loading ──────────────────────────────────────────────────────
  if (loading || !formData) {
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
      {/* Header */}

      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={submitting}
        >
          ← Volver
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Cliente #{id}
          </h1>

          <p className="text-gray-600 mt-1">
            Modifica la información del cliente seleccionado
          </p>
        </div>
      </div>

      {/* Formulario */}

      <ClienteForm
        mode="edit"
        value={formData}
        submitting={submitting}
        error={error}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {/* Advertencia */}

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-semibold text-yellow-900 mb-2">
          ⚠️ Importante
        </h3>

        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Verifica el número de documento antes de guardar</li>

          <li>El email debe ser único si está definido</li>

          <li>Desactivar un cliente evita nuevas ventas</li>
        </ul>
      </div>
    </div>
  );
}
