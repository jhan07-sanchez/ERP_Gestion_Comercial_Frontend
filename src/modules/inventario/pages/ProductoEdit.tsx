import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../hooks/useCategorias";
import { ProductoForm } from "../components/ProductoForm";
import type { ProductoUpdateInput } from "../types";

export default function ProductoEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getProducto, updateProducto, error } = useProductos();
  const { categorias, isLoading } = useCategorias();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductoUpdateInput>({});

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const producto = await getProducto(Number(id));

      setFormData({
        nombre: producto.nombre,
        codigo: producto.codigo,
        descripcion: producto.descripcion,
        categoria:
          typeof producto.categoria === "object"
            ? producto.categoria.id
            : producto.categoria,
        precio_venta: producto.precio_venta,
        precio_compra: producto.precio_compra,
        stock_minimo: producto.stock_minimo,
        estado: producto.estado,
      });

      setLoading(false);
    };

    load();
  }, [id, getProducto]);

  const handleSubmit = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      await updateProducto(Number(id), formData);
      navigate("../productos", { relative: "route" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate("../productos", { relative: "route" })}>
          ← Volver
        </Button>
        <h1 className="text-3xl font-bold">Editar Producto</h1>
      </div>

      <ProductoForm
        value={formData}
        categorias={categorias}
        loadingCategorias={isLoading}
        submitting={submitting}
        error={error}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("../productos", { relative: "route" })}
      />
    </div>
  );
}
