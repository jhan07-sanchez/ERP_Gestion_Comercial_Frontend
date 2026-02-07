// proveedores/components/ProveedorItem.tsx

import React from "react";
import type { Proveedor } from "../types/proveedor.types";

interface ProveedorItemProps {
  proveedor: Proveedor;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleActivo: (id: number, activo: boolean) => void;
  onViewDetail: (id: number) => void;
}

export const ProveedorItem: React.FC<ProveedorItemProps> = ({
  proveedor,
  onEdit,
  onDelete,
  onToggleActivo,
  onViewDetail,
}) => {
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar al proveedor "${proveedor.nombre}"?`,
      )
    ) {
      onDelete(proveedor.id);
    }
  };

  const handleToggleActivo = () => {
    const mensaje = proveedor.estado
      ? `¿Desactivar al proveedor "${proveedor.nombre}"?`
      : `¿Activar al proveedor "${proveedor.nombre}"?`;

    if (window.confirm(mensaje)) {
      onToggleActivo(proveedor.id, !proveedor.estado);
    }
  };

  return (
    <div className={`proveedor-item ${!proveedor.estado ? "inactive" : ""}`}>
      <div className="proveedor-item-header">
        <div className="proveedor-info">
          <h3 className="proveedor-nombre">{proveedor.nombre}</h3>
          <span className="proveedor-documento">{proveedor.identificacion}</span>
          <span
            className={`proveedor-status ${proveedor.estado ? "active" : "inactive"}`}
          >
            {proveedor.estado ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      <div className="proveedor-item-body">
        <div className="proveedor-details">
          {proveedor.telefono && (
            <div className="detail-item">
              <span className="detail-label">Teléfono:</span>
              <span className="detail-value">{proveedor.telefono}</span>
            </div>
          )}

          {proveedor.email && (
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{proveedor.email}</span>
            </div>
          )}

          {proveedor.direccion && (
            <div className="detail-item">
              <span className="detail-label">Dirección:</span>
              <span className="detail-value">{proveedor.direccion}</span>
            </div>
          )}

          <div className="detail-item">
            <span className="detail-label">Creado:</span>
            <span className="detail-value">
              {formatFecha(proveedor.fecha_creacion || "")}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Actualizado:</span>
            <span className="detail-value">
              {formatFecha(proveedor.fecha_actualizacion || "")}
            </span>
          </div>
        </div>
      </div>

      <div className="proveedor-item-actions">
        <button
          onClick={() => onViewDetail(proveedor.id)}
          className="btn btn-sm btn-info"
          title="Ver detalle"
        >
          <span>👁️</span> Ver
        </button>

        <button
          onClick={() => onEdit(proveedor.id)}
          className="btn btn-sm btn-primary"
          title="Editar"
        >
          <span>✏️</span> Editar
        </button>

        <button
          onClick={handleToggleActivo}
          className={`btn btn-sm ${proveedor.estado ? "btn-warning" : "btn-success"}`}
          title={proveedor.estado ? "Desactivar" : "Activar"}
        >
          <span>{proveedor.estado ? "🚫" : "✅"}</span>
          {proveedor.estado ? "Desactivar" : "Activar"}
        </button>

        <button
          onClick={handleDelete}
          className="btn btn-sm btn-danger"
          title="Eliminar"
        >
          <span>🗑️</span> Eliminar
        </button>
      </div>
    </div>
  );
};
