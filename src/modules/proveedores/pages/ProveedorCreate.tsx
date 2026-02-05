// proveedores/pages/ProveedorCreate.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProveedorForm } from "../components/ProveedorForm";
import { useProveedorActions } from "../hooks/useProveedorActions";
import type { ProveedorFormData } from "../types/proveedor.types";

export default function ProveedorCreate() {
  const navigate = useNavigate();
  const { createProveedor, loading, error } = useProveedorActions();

  const handleSubmit = async (data: ProveedorFormData) => {
    const newProveedor = await createProveedor(data);

    if (newProveedor) {
      alert("Proveedor creado exitosamente");
      navigate("/proveedores");
    }
  };

  const handleCancel = () => {
    navigate("/proveedores");
  };

  return (
    <div className="proveedor-create-page">
      <div className="page-header">
        <div className="header-content">
          <button onClick={handleCancel} className="btn-back" title="Volver">
            ← Volver
          </button>
          <div>
            <h1>Crear Nuevo Proveedor</h1>
            <p className="subtitle">
              Complete el formulario para agregar un proveedor
            </p>
          </div>
        </div>
      </div>

      <div className="form-container">
        <ProveedorForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};
