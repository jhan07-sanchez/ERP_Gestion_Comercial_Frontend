import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../hooks/useCategorias";
import { ProductoForm } from "../components/ProductoForm";
import type { ProductoCreateInput } from "../types";

export default function ProductoCreate() {
  const navigate = useNavigate();
  const { createProducto, error } = useProductos();
  const { categorias, isLoading } = useCategorias();

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductoCreateInput>({
    nombre: "",
    codigo: "",
    descripcion: "",
    categoria_id: 0,
    precio_venta: 0,
    precio_compra: 0,
    stock_minimo: 0,
    fecha_ingreso: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await createProducto(formData);
      navigate("../productos", { relative: "route" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate("../productos", { relative: "route" })}>
          ← Volver
        </Button>
        <h1 className="text-3xl font-bold">Nuevo Producto</h1>
      </div>

      <ProductoForm
        value={{
          ...formData,
          categoria: formData.categoria_id,
        }}
        categorias={categorias}
        loadingCategorias={isLoading}
        submitting={submitting}
        error={error}
        onChange={(data) =>
          setFormData({
            ...formData,
            ...data,
            categoria_id: Number(data.categoria ?? 0),
          })
        }
        onSubmit={handleSubmit}
        onCancel={() => navigate("../productos", { relative: "route" })}
      />
    </div>
  );
}
