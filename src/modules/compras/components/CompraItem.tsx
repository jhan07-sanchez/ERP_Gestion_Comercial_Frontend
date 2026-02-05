// src/modules/compras/components/CompraItem.tsx
import { Button } from "@/components/ui";
import type { Compra } from "../types";

interface Props {
  compra: Compra;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);

export function CompraItem({ compra, onView, onEdit, onDelete }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">#{compra.numero_factura}</h3>
        <span className="text-sm text-gray-500">
          {new Date(compra.fecha).toLocaleDateString("es-CO")}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-1">
        <strong>Proveedor:</strong> {compra.proveedor_nombre || "No definido"}
      </p>

      <p className="text-sm text-gray-600 mb-3">
        <strong>Total:</strong>{" "}
        <span className="text-green-700 font-semibold">
          {formatCurrency(compra.total)}
        </span>
      </p>

      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => onView(compra.id)}>
          Ver
        </Button>
        <Button size="sm" variant="primary" onClick={() => onEdit(compra.id)}>
          Editar
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(compra.id)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}
