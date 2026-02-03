// src/modules/compras/pages/CompraCreate.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { useCompras } from "../hooks/useCompras";
import { useProveedores } from "../../inventario/hooks/useProveedores";
import { CompraForm, type CompraCreateInput } from "../components/CompraForm";
import type { Proveedor } from "../types";

export default function CompraCreate() {
  const navigate = useNavigate();
  const { create, error } = useCompras();
  const { proveedores, isLoading: loadingProveedores } = useProveedores();

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CompraCreateInput>({
    numero_factura: "",
    fecha: new Date().toISOString().split("T")[0],
    proveedor_id: 0,
    observaciones: "",
    items: [],
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await create(formData);
      navigate("/compras");
    } catch (err) {
      console.error("Error al crear compra:", err);
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
