// proveedores/pages/ProveedorEdit.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProveedorForm } from "../components/ProveedorForm";
import { useProveedor } from "../hooks/useProveedor";
import { useProveedorActions } from "../hooks/useProveedorActions";
import type { ProveedorFormData } from "../types/proveedor.types";
import { Button } from "@/components/ui";


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

  // ✅ Estado local del formulario (OBLIGATORIO)
  const [formData, setFormData] = useState<ProveedorFormData | null>(null);

  // ✅ Validar ID
  useEffect(() => {
    if (id && isNaN(Number(id))) {
      navigate("/proveedores");
    }
  }, [id, navigate]);

  // ✅ Cargar proveedor
  useEffect(() => {
    if (!proveedorId) return;

    const fetchProveedor = async () => {
      try {
        const data = await getProveedor(proveedorId);
        setFormData(data);
      } catch {
        // error manejado por el hook
      }
    };

    fetchProveedor();
  }, [proveedorId, getProveedor]);

  // ✅ Submit SIN parámetros (como pide ProveedorForm)
  const handleSubmit = async () => {
    if (!proveedorId || !formData) return;

    const ok = await updateProveedor(proveedorId, formData);

    if (ok) {
      alert("Proveedor actualizado exitosamente");
      navigate("/proveedores");
    }
  };

  const handleCancel = () => {
    navigate("/proveedores");
  };

  if (loading || !formData) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando proveedor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-error">
          <h3>Error al cargar proveedor</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate("/proveedores")}
            className="btn btn-primary"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={updateLoading}
          >
            ← Volver
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Editar Proveedor
            </h1>
            <p className="text-gray-600 mt-1">Modificando: {formData.nombre}</p>
          </div>
        </div>
      </div>

      <div className="form-container">
        <ProveedorForm
          value={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitting={updateLoading}
          error={updateError}
        />
      </div>
    </div>
  );
}
