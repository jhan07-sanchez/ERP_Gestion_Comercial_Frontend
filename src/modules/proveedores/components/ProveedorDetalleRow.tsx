/**
 * 📝 COMPONENTE: ProveedorDetalleRow y ProveedorDetalleList
 *
 * Componentes para mostrar los detalles de un proveedor en formato lista.
 * Refactorizado a Tailwind CSS para responsiveness y estética premium.
 */

import React from "react";
import type { Proveedor } from "../types/proveedor.types";
import { Badge } from "@/shared/components/ui";

interface ProveedorDetalleRowProps {
  label: string;
  value: string | number | boolean;
  type?: "text" | "email" | "phone" | "date" | "boolean";
  isLast?: boolean;
}

export const ProveedorDetalleRow: React.FC<ProveedorDetalleRowProps> = ({
  label,
  value,
  type = "text",
  isLast = false,
}) => {
  const renderValue = () => {
    switch (type) {
      case "email":
        return value && value !== "-" ? (
            <a href={`mailto:${value}`} className="text-accent-600 hover:text-accent-800 hover:underline font-medium transition-colors">
                {value}
            </a>
        ) : <span className="text-primary-400 italic font-medium">—</span>;

      case "phone":
        return value && value !== "-" ? (
            <a href={`tel:${value}`} className="text-accent-600 hover:text-accent-800 hover:underline font-medium transition-colors">
                {value}
            </a>
        ) : <span className="text-primary-400 italic font-medium">—</span>;

      case "date":
        if (!value || value === "-") return <span className="text-primary-400 italic font-medium">—</span>;
        return (
            <span className="text-primary-700 font-medium">
                {new Date(value as string).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                })}
            </span>
        );

      case "boolean":
        return (
          <Badge variant={value ? "success" : "danger"} className="uppercase tracking-widest text-xs opacity-80 font-black">
            {value ? "Habilitado" : "Deshabilitado"}
          </Badge>
        );

      default:
        return value && value !== "-" ? (
            <span className="text-primary-700 font-medium">{value}</span>
        ) : <span className="text-primary-400 italic font-medium">—</span>;
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 transition-colors hover:bg-primary-50/50 ${!isLast ? 'border-b border-primary-100' : ''}`}>
      <div className="text-xs font-black text-primary-400 uppercase tracking-widest mb-1 sm:mb-0 w-full sm:w-1/3">
        {label}
      </div>
      <div className="w-full sm:w-2/3 sm:text-right text-sm">
        {renderValue()}
      </div>
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
    <div className="flex flex-col bg-white">
      <ProveedorDetalleRow label="Nombre Comercial" value={proveedor.nombre} />
      <ProveedorDetalleRow label="Documento (NIT/RUT)" value={proveedor.documento ?? "-"} />
      <ProveedorDetalleRow
        label="Teléfono de Contacto"
        value={proveedor.telefono ?? "-"}
        type="phone"
      />
      <ProveedorDetalleRow label="Correo Electrónico" value={proveedor.email ?? "-"} type="email" />
      <ProveedorDetalleRow label="Dirección Física" value={proveedor.direccion ?? "-"} />
      <ProveedorDetalleRow
        label="Estado Operativo"
        value={proveedor.estado}
        type="boolean"
      />
      <ProveedorDetalleRow
        label="Fecha de Creación"
        value={proveedor.fecha_creacion ?? "-"}
        type="date"
      />
      <ProveedorDetalleRow
        label="Última Actualización"
        value={proveedor.fecha_actualizacion ?? "-"}
        type="date"
        isLast={true}
      />
    </div>
  );
};
