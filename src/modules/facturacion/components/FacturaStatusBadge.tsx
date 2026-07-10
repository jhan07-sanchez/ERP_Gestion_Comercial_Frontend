import React from "react";
import type { EstadoFactura } from "../types";
import type { EstadoNota } from "../types/notaCredito.types";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  BORRADOR: { label: "Borrador", color: "bg-gray-100 text-gray-800" },
  EMITIDA: { label: "Emitida", color: "bg-blue-100 text-blue-800" },
  PARCIAL: { label: "Parcial", color: "bg-yellow-100 text-yellow-800" },
  PAGADA: { label: "Pagada", color: "bg-green-100 text-green-800" },
  VENCIDA: { label: "Vencida", color: "bg-red-100 text-red-800" },
  APLICADA: { label: "Aplicada", color: "bg-purple-100 text-purple-800" },
  ANULADA: { label: "Anulada", color: "bg-gray-800 text-white" },
};

export const FacturaStatusBadge: React.FC<{ estado: EstadoFactura | EstadoNota | string }> = ({ estado }) => {
  const config = STATUS_MAP[estado] || STATUS_MAP.BORRADOR;

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
    >
      {config.label}
    </span>
  );
};
