/**
 * 📄 PÁGINA: ClienteCreate
 * Crear nuevo cliente con diseño responsivo.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader, Card } from "@/shared/components/ui";
import { ClienteForm } from "../components/ClienteForm";
import { useClientes } from "../hooks/useClientes";
import type { ClienteFormData } from "../types";
import { normalizeTipoDocumentoForAPI } from "../types";
import { useAlert } from "@/shared/components/alerts";
import { IconUserPlus, IconInfoCircle } from "@tabler/icons-react";

export default function ClienteCreate() {
  const navigate = useNavigate();
  const { createCliente, fetchClientes, error } = useClientes();
  const { showAlert, confirm } = useAlert();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ClienteFormData>({
    nombre: "",
    tipo_documento: "CEDULA",
    numero_documento: "",
    telefono: "",
    email: "",
    direccion: "",
    estado: "ACTIVO",
  });

  const validateForm = (): { valid: boolean; message?: string } => {
    if (!formData.nombre.trim()) {
      return { valid: false, message: "El nombre es obligatorio" };
    }
    if (!formData.tipo_documento) {
      return { valid: false, message: "El tipo de documento es obligatorio" };
    }
    if (!formData.numero_documento.trim()) {
      return { valid: false, message: "El número de documento es obligatorio", };
    }
    if (formData.email && !formData.email.includes("@")) {
      return { valid: false, message: "El email no es válido" };
    }
    return { valid: true };
  };

  const convertToAPIFormat = (data: ClienteFormData) => ({
    nombre: data.nombre.trim(),
    tipo_documento: normalizeTipoDocumentoForAPI(data.tipo_documento),
    numero_documento: data.numero_documento.trim(),
    telefono: data.telefono?.trim() || null,
    email: data.email?.trim() || null,
    direccion: data.direccion?.trim() || null,
    estado: data.estado === "ACTIVO",
  });

  const handleSubmit = async () => {
    const validation = validateForm();

    if (!validation.valid) {
      showAlert("Validación", "warning", { description: validation.message });
      return;
    }

    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(formData);
      const nuevoCliente = await createCliente(apiData);

      if (nuevoCliente) {
        await fetchClientes();
        showAlert("¡Cliente registrado!", "success", { description: "El cliente se ha registrado exitosamente" });
        setTimeout(() => navigate("/clientes"), 500);
      } else {
        throw new Error(error || "Error desconocido al crear cliente");
      }
    } catch (err) {
      const e = err as {
        response?: { status?: number; data?: unknown };
        message?: string;
      };

      let errorMsg = "Error al crear el cliente. Revisa los datos.";

      if (e.response?.data && typeof e.response.data === "object") {
        const backendError = e.response.data as Record<string, unknown>;
        const fieldErrors = Object.entries(backendError)
          .map(([field, messages]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : String(messages);
            return `${field}: ${msg}`;
          })
          .join("\n");
        if (fieldErrors) errorMsg = `Errores:\n${fieldErrors}`;
      }

      showAlert("Error", "error", { description: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (submitting) return;

    const hasData =
      formData.nombre !== "" ||
      formData.numero_documento !== "" ||
      formData.telefono !== "" ||
      formData.email !== "";

    if (hasData) {
      const confirmar = await confirm(
        "Confirmar Cancelación",
        "¿Seguro que deseas cancelar? Se perderán los datos ingresados.",
        "warning"
      );

      if (!confirmar) return;
    }

    navigate("/clientes");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Nuevo Cliente"
        subtitle="Registra un nuevo cliente en el sistema para facturación"
        icon={<IconUserPlus size={24} />}
        onBack={handleCancel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24 lg:pb-0">
        <div className="lg:col-span-2 space-y-6">
            <ClienteForm
                mode="create"
                value={formData}
                submitting={submitting}
                error={error}
                onChange={setFormData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>

        <div className="space-y-6">
            <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm sticky top-6">
                <Card.Content className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <IconInfoCircle size={24} stroke={2} />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-emerald-900">Validaciones</h3>
                    </div>
                    <ul className="text-xs font-medium text-emerald-800 space-y-3">
                        <li className="flex gap-2 isolate">
                            <span className="text-emerald-500 font-bold shrink-0">•</span>
                            <span className="leading-relaxed">El nombre del cliente es obligatorio para realizar una venta.</span>
                        </li>
                        <li className="flex gap-2 isolate">
                            <span className="text-emerald-500 font-bold shrink-0">•</span>
                            <span className="leading-relaxed">El documento (Cédula o NIT) debe ser único en el sistema.</span>
                        </li>
                        <li className="flex gap-2 isolate">
                            <span className="text-emerald-500 font-bold shrink-0">•</span>
                            <span className="leading-relaxed">El cliente quedará activo automáticamente y listo para transacciones.</span>
                        </li>
                    </ul>
                </Card.Content>
            </Card>
        </div>
      </div>
    </PageContainer>
  );
}
