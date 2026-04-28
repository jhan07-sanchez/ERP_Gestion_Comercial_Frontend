/**
 * 📄 PÁGINA: ClienteEdit
 * Editar cliente existente con diseño responsivo
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer, PageHeader } from "@/shared/components/ui";
import { ClienteForm } from "../components/ClienteForm";
import { useClientes } from "../hooks/useClientes";
import type { ClienteFormData, ClienteUpdateInput } from "../types";
import { normalizeTipoDocumentoForAPI } from "../types";
import { useAlert } from "@/shared/components/alerts";
import { IconUserEdit, IconLoader2 } from "@tabler/icons-react";

export default function ClienteEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getCliente, updateCliente, fetchClientes, error } = useClientes();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClienteFormData | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadCliente = async () => {
      try {
        const cliente = await getCliente(Number(id));
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

  const convertToAPIFormat = (data: ClienteFormData): ClienteUpdateInput => ({
    nombre: data.nombre,
    tipo_documento: normalizeTipoDocumentoForAPI(data.tipo_documento),
    numero_documento: data.numero_documento,
    telefono: data.telefono || undefined,
    email: data.email || undefined,
    direccion: data.direccion || undefined,
    estado: data.estado,
  });

  const handleSubmit = async () => {
    if (!id || !formData) return;
    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(formData);
      const success = await updateCliente(Number(id), apiData);

      if (success) {
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

  const handleCancel = () => {
    if (submitting) return;
    navigate("/clientes");
  };

  if (loading || !formData) {
    return (
      <PageContainer>
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <IconLoader2 className="animate-spin text-accent-600" size={48} stroke={1.5} />
            <p className="text-primary-600 font-black uppercase tracking-widest text-[10px] animate-pulse">Cargando información del cliente...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Editar Cliente"
        subtitle={`Modificando información de: ${formData.nombre}`}
        icon={<IconUserEdit size={24} />}
        onBack={handleCancel}
      />

      <div className="max-w-4xl mx-auto w-full pb-24 lg:pb-0">
          <ClienteForm
            mode="edit"
            value={formData}
            submitting={submitting}
            error={error}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
      </div>
    </PageContainer>
  );
}
