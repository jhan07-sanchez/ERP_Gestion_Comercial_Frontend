import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../hooks/useCategorias";
import {
  ProductoForm,
  type ProductoFormData,
} from "../components/ProductoForm";


export default function ProductoCreate() {
  const navigate = useNavigate();
  const { createProducto, error } = useProductos();
  const { categorias, isLoading: loadingCategorias } = useCategorias();
  const [submitting, setSubmitting] = useState(false);

  // ✅ AGREGADO: codigo en estado inicial
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: "",
    codigo: "", // Campo editable ahora
    descripcion: "",
    categoria: 0,
    precio_venta: 0,
    precio_compra: 0, // Siempre inicializado como número
    stock_minimo: 0,
    fecha_ingreso: new Date().toISOString().split("T")[0],
  });

  const convertToAPIFormat = (data: ProductoFormData) => {
    return {
      nombre: data.nombre.trim(),
      codigo: data.codigo.trim(), // Código manual del usuario
      descripcion: data.descripcion?.trim() || undefined,
      categoria: data.categoria, // ✅ CLAVE: DRF espera "categoria", no "categoria_id"
      precio_venta: data.precio_venta,
      precio_compra: data.precio_compra, // Siempre número (estado inicial = 0)
      stock_minimo: data.stock_minimo,
      fecha_ingreso: data.fecha_ingreso,
      estado: true,
    };
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const apiData = convertToAPIFormat(formData);
      console.log("📡 Payload enviado al backend:", apiData);

      const nuevoProducto = await createProducto(apiData);

      // Mostrar código generado (si backend lo devuelve) o el ingresado
      const codigoMostrar = nuevoProducto.codigo || formData.codigo;
      setFormData((prev) => ({ ...prev, codigo: codigoMostrar }));

      alert(`¡Producto creado exitosamente!\nCódigo: ${codigoMostrar}`);
      setTimeout(() => navigate("/productos"), 1500);
    } catch (err) {
      // ✅ CORREGIDO: Sin "any", usando tipo seguro para errores de Axios
      const error = err as {
        response?: { status?: number; data?: unknown };
        message?: string;
      };

      console.error("❌ ERROR DEL BACKEND:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMsg = "Error al crear el producto. Revisa los datos.";
      if (error.response?.data && typeof error.response.data === "object") {
        const backendError = error.response.data as Record<string, unknown>;
        const fieldErrors = Object.entries(backendError)
          .map(([field, messages]) => {
            const msg = Array.isArray(messages)
              ? messages.join(", ")
              : String(messages);
            return `${field}: ${msg}`;
          })
          .join("\n");

        if (fieldErrors) errorMsg = `Errores:\n${fieldErrors}`;
      }

      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;

    // ✅ CORREGIDO: precio_compra siempre definido (estado inicial = 0)
    // Usamos ?? 0 por seguridad tipográfica aunque el estado lo inicializa
    const hasData =
      formData.nombre.trim() ||
      formData.descripcion?.trim() ||
      formData.categoria !== 0 ||
      formData.precio_venta > 0 ||
      (formData.precio_compra ?? 0) > 0 || // ✅ Manejo seguro de undefined
      formData.stock_minimo > 0 ||
      formData.codigo.trim().length > 0; // Incluir código en validación

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
            Ingresa un código único para el producto
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

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Nota</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>El código debe ser único (ej: ARROZ-5KG, LAPTOP-DELL)</li>
          <li>Todos los campos marcados con * son obligatorios</li>
          <li>El sistema validará unicidad del código al guardar</li>
        </ul>
      </div>
    </div>
  );
}
