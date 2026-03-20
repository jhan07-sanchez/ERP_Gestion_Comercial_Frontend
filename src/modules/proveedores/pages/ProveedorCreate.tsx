/**
 * 📄 PÁGINA: ProveedorCreate
 *
 * Página para crear un nuevo proveedor con diseño responsivo
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader, Card } from "@/shared/components/ui";

import { ProveedorForm } from "../components/ProveedorForm";
import { useProveedorActions } from "../hooks/useProveedorActions";
import type { ProveedorFormData } from "../types/proveedor.types";
import { useAlert } from "@/shared/components/alerts";
import { IconBuildingStore, IconInfoCircle } from "@tabler/icons-react";

export default function ProveedorCreate() {
  const navigate = useNavigate();
  const { createProveedor, loading, error } = useProveedorActions();
  const { showAlert, confirm } = useAlert();

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProveedorFormData>({
    nombre: "",
    documento: "",
    telefono: "",
    email: "",
    direccion: "",
    estado: true,
  });

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const newProveedor = await createProveedor(formData);

      if (newProveedor) {
        showAlert("¡Proveedor Creado!", "success", { description: "El proveedor se ha registrado exitosamente" });
        navigate("/proveedores");
      }
    } catch (err) {
      const error = err as {
        response?: { status?: number; data?: unknown };
        message?: string;
      };

      let errorMsg = "Error al crear el proveedor. Revisa los datos.";

      if (error.response?.data && typeof error.response.data === "object") {
        const backendError = error.response.data as Record<string, unknown>;

        const fieldErrors = Object.entries(backendError)
          .map(([field, messages]) => {
            const msg = Array.isArray(messages)
              ? messages.join(", ")
              : String(messages);
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
      formData.nombre.trim().length > 0 ||
      (formData.documento ?? "").trim().length > 0 ||
      (formData.telefono ?? "").trim().length > 0 ||
      (formData.email ?? "").trim().length > 0 ||
      (formData.direccion ?? "").trim().length > 0;


    if (hasData) {
      const confirmar = await confirm(
        "Confirmar Cancelación",
        "¿Seguro que deseas cancelar? Se perderán los datos ingresados.",
        "warning"
      );
      if (!confirmar) return;
    }

    navigate("/proveedores");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Nuevo Proveedor"
        subtitle="Registra un socio comercial para compras y abastecimiento"
        icon={<IconBuildingStore size={24} />}
        onBack={handleCancel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24 lg:pb-0">
        <div className="lg:col-span-2 space-y-6">
            <ProveedorForm
                value={formData}
                submitting={submitting || loading}
                error={error}
                onChange={setFormData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>

        <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50/50 shadow-sm sticky top-6">
                <Card.Content className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <IconInfoCircle size={24} stroke={2} />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-blue-900">Tips de Registro</h3>
                    </div>
                    <ul className="text-xs font-medium text-blue-800 space-y-3">
                        <li className="flex gap-2 isolate">
                            <span className="text-blue-500 font-bold shrink-0">•</span>
                            <span className="leading-relaxed">El <strong>nombre comercial</strong> o razón social es obligatorio para facturación y documentos formales.</span>
                        </li>
                        <li className="flex gap-2 isolate">
                            <span className="text-blue-500 font-bold shrink-0">•</span>
                            <span className="leading-relaxed">Ingresar el <strong>NIT / RUT</strong> correcto evita que se generen registros duplicados en contabilidad.</span>
                        </li>
                        <li className="flex gap-2 isolate">
                            <span className="text-blue-500 font-bold shrink-0">•</span>
                            <span className="leading-relaxed">Solo los proveedores marcados como <strong>Activos</strong> aparecerán en el módulo de compras.</span>
                        </li>
                    </ul>
                </Card.Content>
            </Card>
        </div>
      </div>
    </PageContainer>
  );
}
