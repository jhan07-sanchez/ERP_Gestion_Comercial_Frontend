/**
 * 📄 PÁGINA: ProveedorEdit
 *
 * Página para editar un proveedor existente con diseño responsivo
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProveedorForm } from "../components/ProveedorForm";
import { useProveedor } from "../hooks/useProveedor";
import { useProveedorActions } from "../hooks/useProveedorActions";
import type { ProveedorFormData } from "../types/proveedor.types";
import { Button, PageContainer, PageHeader } from "@/shared/components/ui";
import { useAlert } from "@/shared/components/alerts";
import { IconBuildingStore, IconLoader2, IconAlertCircle } from "@tabler/icons-react";

export default function ProveedorEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const proveedorId = id ? parseInt(id, 10) : undefined;

  const { getProveedor, loading, error } = useProveedor();
  const {
    updateProveedor,
    loading: updateLoading,
    error: updateError,
  } = useProveedorActions();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState<ProveedorFormData | null>(null);

  useEffect(() => {
    if (id && isNaN(Number(id))) {
      navigate("/proveedores");
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!proveedorId) return;

    const fetchProveedor = async () => {
      try {
        const data = await getProveedor(proveedorId);
        setFormData(data);
      } catch {
        showAlert("Error", "error", { description: "No se pudo cargar la información del proveedor." });
        navigate("/proveedores");
      }
    };

    fetchProveedor();
  }, [proveedorId, getProveedor, navigate, showAlert]);

  const handleSubmit = async () => {
    if (!proveedorId || !formData) return;

    const ok = await updateProveedor(proveedorId, formData);

    if (ok) {
        showAlert("¡Proveedor Actualizado!", "success", { description: "Los datos del proveedor se han actualizado correctamente." });
        navigate("/proveedores");
    }
  };

  const handleCancel = () => {
    navigate("/proveedores/lista");
  };

  if (loading || !formData) {
    return (
      <PageContainer>
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <IconLoader2 className="animate-spin text-accent-600" size={48} stroke={1.5} />
            <p className="text-primary-600 font-black uppercase tracking-widest text-xs animate-pulse">Cargando información del proveedor...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full text-center space-y-6 bg-danger-50/50 p-10 rounded-3xl border border-danger-100 shadow-sm backdrop-blur-sm">
            <div className="w-20 h-20 bg-danger-100 text-danger-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-danger-200/50">
              <IconAlertCircle size={40} stroke={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-danger-900 uppercase tracking-tight">Error al cargar proveedor</h3>
              <p className="text-sm text-danger-700 font-medium leading-relaxed">{error}</p>
            </div>
            <Button 
                onClick={() => navigate("/proveedores")} 
                className="w-full h-12 bg-danger-600 hover:bg-danger-700 text-white border-none shadow-xl shadow-danger-200 font-black uppercase tracking-widest text-xs"
            >
              Volver al Directorio
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Editar Proveedor"
        subtitle={`Modificando información de: ${formData.nombre}`}
        icon={<IconBuildingStore size={24} />}
        onBack={handleCancel}
      />

      <div className="max-w-4xl mx-auto w-full pb-24 lg:pb-0">
        <ProveedorForm
          value={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitting={updateLoading}
          error={updateError}
        />
      </div>
    </PageContainer>
  );
}
