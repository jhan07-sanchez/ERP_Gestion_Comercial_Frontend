// proveedores/components/ProveedorResumen.tsx

import React from "react";
import type { Proveedor } from "../types/proveedor.types";

interface ProveedorResumenProps {
  proveedor: Proveedor;
  onClick?: () => void;
}

export const ProveedorResumen: React.FC<ProveedorResumenProps> = ({
  proveedor,
  onClick,
}) => {
  return (
    <div
      className={`proveedor-resumen ${onClick ? "clickable" : ""} ${!proveedor.activo ? "inactive" : ""}`}
      onClick={onClick}
    >
      <div className="resumen-header">
        <h4 className="resumen-nombre">{proveedor.nombre}</h4>
        <span
          className={`badge ${proveedor.activo ? "badge-success" : "badge-danger"}`}
        >
          {proveedor.activo ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className="resumen-body">
        <div className="resumen-info">
          <span className="info-label">Documento:</span>
          <span className="info-value">{proveedor.documento}</span>
        </div>

        {proveedor.telefono && (
          <div className="resumen-info">
            <span className="info-label">📞</span>
            <span className="info-value">{proveedor.telefono}</span>
          </div>
        )}

        {proveedor.email && (
          <div className="resumen-info">
            <span className="info-label">📧</span>
            <span className="info-value">{proveedor.email}</span>
          </div>
        )}
      </div>
    </div>
  );
};
