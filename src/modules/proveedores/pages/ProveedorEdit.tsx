// proveedores/pages/ProveedorEdit.tsx

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProveedorForm } from "../components/ProveedorForm";
import { useProveedor } from "../hooks/useProveedor";
import { useProveedorActions } from "../hooks/useProveedorActions";
import type { ProveedorFormData } from "../types/proveedor.types";

export default function ProveedorEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const proveedorId = id ? parseInt(id) : undefined;

  const { proveedor, loading, error } = useProveedor(proveedorId);
  const {
    updateProveedor,
    loading: updateLoading,
    error: updateError,
  } = useProveedorActions();

  useEffect(() => {
    if (id && isNaN(Number(id))) {
      navigate("/proveedores");
    }
  }, [id, navigate]);

  const handleSubmit = async (data: ProveedorFormData) => {
    if (!proveedorId) return;

    const updatedProveedor = await updateProveedor(proveedorId, data);

    if (updatedProveedor) {
      alert("Proveedor actualizado exitosamente");
      navigate("/proveedores");
    }
  };

  const handleCancel = () => {
    navigate("/proveedores");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando proveedor...</p>
      </div>
    );
  }

  if (error || !proveedor) {
    return (
      <div className="error-container">
        <div className="alert alert-error">
          <h3>Error al cargar proveedor</h3>
          <p>{error || "Proveedor no encontrado"}</p>
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
    <div className="proveedor-edit-page">
      <div className="page-header">
        <div className="header-content">
          <button onClick={handleCancel} className="btn-back" title="Volver">
            ← Volver
          </button>
          <div>
            <h1>Editar Proveedor</h1>
            <p className="subtitle">Modificando: {proveedor.nombre}</p>
          </div>
        </div>
      </div>

      <div className="form-container">
        <ProveedorForm
          proveedor={proveedor}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updateLoading}
          error={updateError}
        />
      </div>
    </div>
  );
};
