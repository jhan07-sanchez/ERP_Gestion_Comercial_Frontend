// proveedores/pages/ProveedorDetailPage.tsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProveedor } from "../hooks/useProveedor";
import { useProveedorActions } from "../hooks/useProveedorActions";
import { ProveedorDetalleList } from "../components/ProveedorDetalleRow";

export default function ProveedorDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const proveedorId = id ? parseInt(id) : undefined;

  const { proveedor, loading, error, refresh } = useProveedor(proveedorId);
  const {
    deleteProveedor,
    toggleActivoProveedor,
    loading: actionLoading,
  } = useProveedorActions();

  const handleEdit = () => {
    if (proveedorId) {
      navigate(`/proveedores/edit/${proveedorId}`);
    }
  };

  const handleDelete = async () => {
    if (!proveedorId || !proveedor) return;

    if (
      window.confirm(
        `¿Estás seguro de eliminar al proveedor "${proveedor.nombre}"?`,
      )
    ) {
      const success = await deleteProveedor(proveedorId);
      if (success) {
        alert("Proveedor eliminado exitosamente");
        navigate("/proveedores");
      }
    }
  };

  const handleToggleActivo = async () => {
    if (!proveedorId || !proveedor) return;

    const mensaje = proveedor.activo
      ? `¿Desactivar al proveedor "${proveedor.nombre}"?`
      : `¿Activar al proveedor "${proveedor.nombre}"?`;

    if (window.confirm(mensaje)) {
      const result = await toggleActivoProveedor(
        proveedorId,
        !proveedor.activo,
      );
      if (result) {
        refresh();
      }
    }
  };

  const handleBack = () => {
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
          <button onClick={handleBack} className="btn btn-primary">
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

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
              className={`status-badge ${proveedor.activo ? "active" : "inactive"}`}
            >
              {proveedor.activo ? "✓ Activo" : "✕ Inactivo"}
            </span>
          </div>
        </div>

        <div className="header-actions">
          <button onClick={handleEdit} className="btn btn-primary">
            <span>✏️</span> Editar
          </button>
          <button
            onClick={handleToggleActivo}
            className={`btn ${proveedor.activo ? "btn-warning" : "btn-success"}`}
          >
            <span>{proveedor.activo ? "🚫" : "✅"}</span>
            {proveedor.activo ? "Desactivar" : "Activar"}
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            <span>🗑️</span> Eliminar
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
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Compras realizadas</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total comprado</span>
              <span className="stat-value">$0.00</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Última compra</span>
              <span className="stat-value">-</span>
            </div>
          </div>
          <p className="text-muted">
            * Las estadísticas se mostrarán cuando se integre el módulo de
            compras
          </p>
        </div>

        <div className="detail-card">
          <h2 className="card-title">Historial de Actividad</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">📝</span>
              <div className="activity-content">
                <p className="activity-title">Proveedor creado</p>
                <p className="activity-date">
                  {new Date(proveedor.fecha_creacion).toLocaleString("es-ES")}
                </p>
              </div>
            </div>
            {proveedor.fecha_actualizacion !== proveedor.fecha_creacion && (
              <div className="activity-item">
                <span className="activity-icon">✏️</span>
                <div className="activity-content">
                  <p className="activity-title">Última actualización</p>
                  <p className="activity-date">
                    {new Date(proveedor.fecha_actualizacion).toLocaleString(
                      "es-ES",
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {actionLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};
