// proveedores/pages/ProveedorDetailPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProveedorDetail } from "../hooks/useProveedorDetail";
import { useProveedorActions } from "../hooks/useProveedorActions";
import { ProveedorDetalleList } from "../components/ProveedorDetalleRow";
import type { ProveedorDetail } from "../types/proveedor.types";

export default function ProveedorDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const proveedorId = id ? parseInt(id, 10) : undefined;

  const [proveedor, setProveedor] = useState<ProveedorDetail | null>(null);

  const { getProveedor, loading, error } = useProveedorDetail();

  const {
    deleteProveedor,
    updateProveedor,
    loading: actionLoading,
  } = useProveedorActions();

  // 🔁 Cargar proveedor
  useEffect(() => {
    if (!proveedorId) return;

    getProveedor(proveedorId).then(setProveedor);
  }, [proveedorId, getProveedor]);

  const handleBack = () => navigate("/proveedores");

  const handleEdit = () => {
    if (proveedorId) navigate(`/proveedores/edit/${proveedorId}`);
  };

  const handleDelete = async () => {
    if (!proveedorId || !proveedor) return;

    if (window.confirm(`¿Eliminar al proveedor "${proveedor.nombre}"?`)) {
      const success = await deleteProveedor(proveedorId);
      if (success) {
        navigate("/proveedores");
      }
    }
  };

  const handleToggleActivo = async () => {
    if (!proveedorId || !proveedor) return;

    if (
      window.confirm(
        proveedor.estado
          ? `¿Desactivar "${proveedor.nombre}"?`
          : `¿Activar "${proveedor.nombre}"?`
      )
    ) {
      const ok = await updateProveedor(proveedorId, {
        estado: !proveedor.estado,
      });

      if (ok) {
        const actualizado = await getProveedor(proveedorId);
        setProveedor(actualizado);
      }
    }
  };

  // ⏳ Loading
  if (loading) {
    return <p>Cargando proveedor...</p>;
  }

  // ❌ Error
  if (error || !proveedor) {
    return (
      <div>
        <p>{error || "Proveedor no encontrado"}</p>
        <button onClick={handleBack}>Volver</button>
      </div>
    );
  }

  // ✅ Render principal
  return (
    <div className="proveedor-detail-page">
      <div className="page-header">
        <div className="header-content">
          <button onClick={handleBack} className="btn-back" title="Volver">
            ← Volver
          </button>

          <div className="header-info">
            <h1>{proveedor.nombre}</h1>
            <span
              className={`status-badge ${
                proveedor.estado ? "active" : "inactive"
              }`}
            >
              {proveedor.estado ? "✓ Activo" : "✕ Inactivo"}
            </span>
          </div>
        </div>

        <div className="header-actions">
          <button onClick={handleEdit} className="btn btn-primary">
            ✏️ Editar
          </button>

          <button
            onClick={handleToggleActivo}
            className={`btn ${
              proveedor.estado ? "btn-warning" : "btn-success"
            }`}
          >
            {proveedor.estado ? "🚫 Desactivar" : "✅ Activar"}
          </button>

          <button onClick={handleDelete} className="btn btn-danger">
            🗑️ Eliminar
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-card">
          <h2 className="card-title">Información del Proveedor</h2>
          <ProveedorDetalleList proveedor={proveedor} />
        </div>

        <div className="detail-card">
          <h2 className="card-title">Estadísticas</h2>
          <p className="text-muted">
            * Se integrarán cuando esté listo el módulo de compras
          </p>
        </div>

        <div className="detail-card">
          <h2 className="card-title">Historial</h2>
          <p>
            Creado el{" "}
            {new Date(proveedor.fecha_creacion ?? "").toLocaleString("es-ES")}
          </p>
        </div>
      </div>

      {actionLoading && (
        <div className="loading-overlay">
          <p>Procesando...</p>
        </div>
      )}
    </div>
  );
}
