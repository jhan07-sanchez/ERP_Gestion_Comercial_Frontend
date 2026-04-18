import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, PageContainer, PageHeader, Card } from "@/shared/components/ui";
import { useSuscripcion } from "@/modules/auth/hooks/useSuscripcion";
import { useProductoActions } from "../hooks";
import { useCategorias } from "../../../modules/categorias/hooks/useCategorias";
import {
  ProductoForm,
  type ProductoFormData,
} from "../components/ProductoForm";
import { useAlert } from "@/shared/components/alerts";
import { IconPackage, IconArrowLeft, IconInfoCircle } from "@tabler/icons-react";

export default function ProductoCreate() {
  const navigate = useNavigate();

  const { createProducto, error } = useProductoActions();
  const { showAlert, confirm } = useAlert();
  const { isReadOnly } = useSuscripcion();

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

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const convertToAPIFormat = (data: ProductoFormData) => {
    return {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || undefined,
      categoria: Number(data.categoria),
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

      showAlert("Producto Creado", "success", {
        description: `¡Producto creado exitosamente! Código: ${nuevoProducto.codigo}`
      });

      setTimeout(() => navigate("/productos"), 1500);
    } catch (err: unknown) {
      console.error("❌ ERROR AL CREAR PRODUCTO:", err);
      const errorMsg = err instanceof Error ? err.message : "Error al crear el producto.";
      showAlert("Error", "error", { description: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
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
      const confirmar = await confirm(
        "Confirmar Cancelación",
        "¿Seguro que deseas cancelar? Se perderán los datos ingresados.",
        "warning"
      );

      if (!confirmar) return;
    }

    navigate("/productos");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Nuevo Producto"
        subtitle="Crea un nuevo producto en el catálogo"
        icon={<IconPackage size={24} />}
        backButton={
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleCancel}
            className="p-2 h-10 w-10 flex items-center justify-center rounded-xl"
          >
            <IconArrowLeft size={20} />
          </Button>
        }
      />

      <div className="space-y-6">
        <ProductoForm
          mode="create"
          value={formData}
          categorias={categorias}
          loadingCategorias={loadingCategorias}
          submitting={submitting || isReadOnly}
          error={isReadOnly ? "No puedes crear productos: tu periodo de prueba ha expirado." : error}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        <Card className="bg-blue-50 border-blue-100">
          <Card.Content className="p-4 flex gap-3">
            <IconInfoCircle className="text-blue-500 shrink-0" size={20} />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-blue-900">Información</h3>
              <p className="text-xs text-blue-800 opacity-90">
                Los productos creados aparecerán inmediatamente en el catálogo de ventas y compras. 
                Asegúrate de asignar la categoría correcta para reportes precisos.
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </PageContainer>
  );
}
