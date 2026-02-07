// proveedores/components/ProveedorDetalleRow.tsx

import React from "react";
import type { Proveedor } from "../types/proveedor.types";

interface ProveedorDetalleRowProps {
  label: string;
  value: string | number | boolean;
  type?: "text" | "email" | "phone" | "date" | "boolean";
}

export const ProveedorDetalleRow: React.FC<ProveedorDetalleRowProps> = ({
  label,
  value,
  type = "text",
}) => {
  const renderValue = () => {
    switch (type) {
      case "email":
        return <a href={`mailto:${value}`}>{value}</a>;

      case "phone":
        return <a href={`tel:${value}`}>{value}</a>;

      case "date":
        return new Date(value as string).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

      case "boolean":
        return (
          <span className={`badge ${value ? "badge-success" : "badge-danger"}`}>
            {value ? "Sí" : "No"}
          </span>
        );

      default:
        return value || "-";
    }
  };

  return (
    <div className="detalle-row">
      <div className="detalle-label">{label}:</div>
      <div className="detalle-value">{renderValue()}</div>
    </div>
  );
};

// Componente auxiliar para mostrar todos los detalles de un proveedor
interface ProveedorDetalleListProps {
  proveedor: Proveedor;
}

export const ProveedorDetalleList: React.FC<ProveedorDetalleListProps> = ({
  proveedor,
}) => {
  return (
    <div className="proveedor-detalle-list">
      <ProveedorDetalleRow label="Nombre" value={proveedor.nombre} />
      <ProveedorDetalleRow label="Documento" value={proveedor.identificacion ?? "-"} />
      <ProveedorDetalleRow
        label="Teléfono"
        value={proveedor.telefono ?? "-"}
        type="phone"
      />
      <ProveedorDetalleRow label="Email" value={proveedor.email ?? "-"} type="email" />
      <ProveedorDetalleRow label="Dirección" value={proveedor.direccion ?? "-"} />
      <ProveedorDetalleRow
        label="Activo"
        value={proveedor.estado}
        type="boolean"
      />
      <ProveedorDetalleRow
        label="Fecha de creación"
        value={proveedor.fecha_creacion ?? "-"}
        type="date"
      />
      <ProveedorDetalleRow
        label="Última actualización"
        value={proveedor.fecha_actualizacion ?? "-"}
        type="date"
      />
    </div>
  );
};
