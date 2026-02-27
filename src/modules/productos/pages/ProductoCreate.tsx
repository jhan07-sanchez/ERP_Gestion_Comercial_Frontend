import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { useProductoActions } from "../hooks";
import { useCategorias } from "../../../modules/categorias/hooks/useCategorias";
import {
  ProductoForm,
  type ProductoFormData,
} from "../components/ProductoForm";

export default function ProductoCreate() {
  const navigate = useNavigate();

  const { createProducto, error } = useProductoActions();

  // ✅ CORRECCIÓN: agregar fetchCategorias
  const {
    categorias,
    isLoading: loadingCategorias,
    fetchCategorias,
  } = useCategorias();

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: "",
    codigo: "",
    descripcion: "",
    categoria: 0,
    precio_venta: 0,
    precio_compra: 0,
    stock_minimo: 0,
    fecha_ingreso: new Date().toISOString().split("T")[0],
  });

  // ✅ CORRECCIÓN CRÍTICA: cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const convertToAPIFormat = (data: ProductoFormData) => {
    return {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || undefined,
      categoria: Number(data.categoria), // ✅ asegurar number
      precio_venta: Number(data.precio_venta),
      precio_compra: Number(data.precio_compra),
      stock_minimo: Number(data.stock_minimo),
      fecha_ingreso: data.fecha_ingreso,
      estado: true,
    };
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(formData);

      const nuevoProducto = await createProducto(apiData);
      console.log("Respuesta backend:", nuevoProducto);

      alert(`¡Producto creado exitosamente!\nCódigo: ${nuevoProducto.codigo}`);

      setTimeout(() => navigate("/productos"), 1500);
    } catch (err: unknown) {
      console.error("❌ ERROR AL CREAR PRODUCTO:", err);

      alert(err instanceof Error ? err.message : "Error al crear el producto.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;

    const hasData =
      formData.nombre.trim() ||
      formData.descripcion?.trim() ||
      formData.categoria !== 0 ||
      formData.precio_venta > 0 ||
      (formData.precio_compra ?? 0) > 0 ||
      formData.stock_minimo > 0 ||
      formData.codigo.trim().length > 0;

    if (hasData) {
      const confirmar = window.confirm(
        "¿Seguro que deseas cancelar? Se perderán los datos ingresados.",
      );

      if (!confirmar) return;
    }

    navigate("/productos");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={submitting}
        >
          ← Volver
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>

          <p className="text-gray-600 mt-1">
            Crea un nuevo producto en el catálogo
          </p>
        </div>
      </div>

      <ProductoForm
        mode="create"
        value={formData}
        categorias={categorias}
        loadingCategorias={loadingCategorias}
        submitting={submitting}
        error={error}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
