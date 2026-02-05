import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";

import { useCompras } from "../hooks/useCompra";
import { CompraForm } from "../components/CompraForm";

import type { CompraCreateInput } from "../types";
import type { CompraFormData } from "../types/compra-form.types";

import { useProveedor } from "@/modules/proveedores/hooks/useProveedor";

export default function CompraCreate() {
  const navigate = useNavigate();

  // Hooks de dominio
  const { create, error } = useCompras();
  const { proveedores, loading: loadingProveedores } = useProveedor();

  // Estado UI
  const [submitting, setSubmitting] = useState(false);

  // Estado del formulario (NO DTO del backend)
  const [formData, setFormData] = useState<CompraFormData>({
    numero_factura: "",
    fecha: new Date().toISOString().split("T")[0],
    proveedor_id: 0,
    observaciones: "",
    items: [],
  });

  // Submit
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // Transformación UI → API
      const payload: CompraCreateInput = {
        numero_factura: formData.numero_factura,
        fecha: formData.fecha,
        proveedor_id: formData.proveedor_id,
        observaciones: formData.observaciones,
        items: formData.items.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
        })),
      };

      await create(payload);
      navigate("/compras");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    navigate("/compras");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={submitting}
        >
          ← Volver
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Compra</h1>
          <p className="text-gray-600 mt-1">
            Registra una nueva compra a proveedores
          </p>
        </div>
      </div>

      {/* Formulario */}
      <CompraForm
        mode="create"
        value={formData}
        proveedores={proveedores}
        loadingProveedores={loadingProveedores}
        submitting={submitting}
        error={error}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {/* Ayuda */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          💡 Información
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Selecciona un proveedor de la lista</li>
          <li>Agrega productos con su cantidad y precio unitario</li>
          <li>El subtotal se calcula automáticamente</li>
          <li>El total de la compra se muestra en la parte inferior</li>
        </ul>
      </div>
    </div>
  );
}
