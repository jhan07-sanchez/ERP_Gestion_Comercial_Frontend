import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/shared/components/alerts";
import { PageContainer, PageHeader, Button } from "@/shared/components/ui";
import { CajaForm } from "../components/CajaForm";
import { useCajaActions } from "../hooks/useCajaActions";
import { CajaService } from "../services/cajaService";
import { IconPlus, IconArrowLeft, IconBulb } from "@tabler/icons-react";
import type { CajaFormData } from "../types/Caja.types";

export default function CajaCreatePage() {
  const navigate = useNavigate();
  const { showAlert, confirm } = useAlert();
  const { loading, error, abrirCaja } = useCajaActions();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CajaFormData>({
    nombre: "",
    monto_inicial: "",
    observaciones: "",
  });

  const validateForm = (): { valid: boolean; message?: string } => {
    if (!formData.nombre.trim()) {
      return { valid: false, message: "El nombre de la caja es obligatorio" };
    }
    if (!formData.monto_inicial) {
      return { valid: false, message: "Debes ingresar un monto inicial" };
    }
    const monto = parseFloat(formData.monto_inicial);
    if (isNaN(monto)) {
      return { valid: false, message: "El monto inicial no es válido" };
    }
    if (monto < 0) {
      return { valid: false, message: "El monto inicial no puede ser negativo" };
    }
    return { valid: true };
  };

  const convertToAPIFormat = (data: CajaFormData) => {
    return {
      caja_id: 1, // TODO: permitir seleccionar caja
      monto_inicial: parseFloat(data.monto_inicial),
      observaciones: data.observaciones?.trim() || "",
    };
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.valid) {
      showAlert("Validación", "warning", { description: validation.message });
      return;
    }

    setSubmitting(true);
    try {
      CajaService.validarApertura(formData.nombre, parseFloat(formData.monto_inicial));
      const apiData = convertToAPIFormat(formData);
      const resultado = await abrirCaja(apiData);

      if (resultado) {
        showAlert("¡Caja abierta!", "success", {
          description: "La sesión de caja se ha iniciado correctamente",
        });
        setTimeout(() => {
          navigate(`/caja/sesion/${resultado.id}`);
        }, 500);
      } else {
        throw new Error(error || "Error desconocido al abrir caja");
      }
    } catch (err) {
      console.error("❌ Error al abrir caja:", err);
      const errorMsg = "Error al abrir la caja.";
      showAlert("Error", "error", { description: errorMsg });
    } finally {

      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (submitting) return;
    const hasData = formData.nombre.trim() !== "" || formData.monto_inicial !== "" || (formData.observaciones?.trim() ?? "").length > 0;
    if (hasData) {
      const confirmar = await confirm("Confirmar Cancelación", "¿Seguro que deseas cancelar? Se perderán los datos ingresados.", "warning");
      if (!confirmar) return;
    }
    navigate("/caja");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-primary-600 font-medium tracking-tight">Abriendo caja...</p>
        </div>
      </div>
    );
  }

  return (
    <PageContainer maxWidth="md">
      <PageHeader
        title="Crear Nueva Caja"
        subtitle="Registra una nueva terminal de cobro"
        icon={<IconPlus size={24} />}
        backButton={
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleCancel}
            className="p-2 h-10 w-10 flex items-center justify-center rounded-xl"
          >
            <IconArrowLeft size={20} />
          </Button>
        }
      />

      <CajaForm
        value={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
        error={error}
        mode="create"
      />

      <div className="p-5 bg-accent-50/50 border border-accent-100 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 shrink-0 shadow-sm border border-accent-200">
          <IconBulb size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-accent-900 mb-1 uppercase tracking-wider">💡 Recomendaciones</h3>
          <ul className="text-xs text-accent-800 space-y-1.5 list-disc list-inside font-medium opacity-90">
            <li>Asegúrate de contar el efectivo inicial con precisión.</li>
            <li>El nombre de la caja debe ser único y descriptivo (ej: "Caja Principal - Sede Norte").</li>
            <li>El monto inicial se registrará como el balance base de la sesión.</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}

