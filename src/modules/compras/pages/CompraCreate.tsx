import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, PageContainer, PageHeader, Card } from "@/shared/components/ui";
import { CompraForm, type CompraFormData } from "../components/CompraForm";
import { useCompras } from "../hooks/useCompras";
import { useProveedor } from "@/modules/proveedores/hooks/useProveedor";
import { useProductosList as useProductos } from "@/modules/productos/hooks/useProductosList";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { IconShoppingCart, IconLock, IconBulb, IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";

export default function CompraCreate() {
  const navigate = useNavigate();
  const { createCompra, fetchCompras, error } = useCompras();
  const { isCajaAbierta } = useCajaStore();
  const { showAlert, confirm } = useAlert();
  const {
    proveedores,
    fetchProveedores,
    isLoading: loadingProveedores,
    error: errorProveedores,
  } = useProveedor();

  const {
    productos,
    fetchProductos,
    isLoading: loadingProductos,
    error: errorProductos,
  } = useProductos();

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CompraFormData>({
    proveedor_id: 0,
    fecha: new Date().toISOString().split("T")[0],
    observaciones: "",
    detalles: [],
    total: 0,
  });

  useEffect(() => {
    fetchProveedores().catch(() => { });
    fetchProductos().catch(() => { });
  }, [fetchProveedores, fetchProductos]);

  const validateForm = (): { valid: boolean; message?: string } => {
    if (!formData.proveedor_id || formData.proveedor_id === 0) {
      return { valid: false, message: "Debes seleccionar un proveedor" };
    }
    if (!formData.fecha) {
      return { valid: false, message: "La fecha es obligatoria" };
    }
    const fechaCompra = new Date(formData.fecha);
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    if (fechaCompra > hoy) {
      return { valid: false, message: "La fecha no puede ser futura" };
    }
    if (formData.detalles.length === 0) {
      return { valid: false, message: "Debes agregar al menos un producto" };
    }
    for (let i = 0; i < formData.detalles.length; i++) {
      const detalle = formData.detalles[i];
      if (!detalle.producto || detalle.producto === 0) {
        return { valid: false, message: `Producto #${i + 1}: Debes seleccionar un producto` };
      }
      if (!detalle.cantidad || detalle.cantidad <= 0) {
        return { valid: false, message: `Producto #${i + 1}: La cantidad debe ser mayor a 0` };
      }
      if (!detalle.precio_unitario || detalle.precio_unitario <= 0) {
        return { valid: false, message: `Producto #${i + 1}: El precio debe ser mayor a 0` };
      }
    }
    if (formData.total <= 0) {
      return { valid: false, message: "El total debe ser mayor a 0" };
    }
    return { valid: true };
  };

  const convertToAPIFormat = (data: CompraFormData) => {
    return {
      proveedor_id: data.proveedor_id,
      fecha: data.fecha,
      observaciones: data.observaciones?.trim() || undefined,
      detalles: data.detalles.map((d) => ({
        producto_id: d.producto,
        cantidad: Number(d.cantidad) || 0,
        precio_compra: Number(d.precio_unitario) || 0,
      })),
    };
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.valid) {
      showAlert("Validación", "warning", { description: validation.message });
      return;
    }

    setSubmitting(true);
    try {
      const apiData = convertToAPIFormat(formData);
      const success = await createCompra(apiData);
      if (success) {
        await fetchCompras();
        showAlert("¡Compra registrada!", "success", { description: "La compra se ha registrado exitosamente" });
        setTimeout(() => {
          navigate(`/compras/${success.id}/detalles?abrirPago=true`);
        }, 800);
      } else {
        throw new Error(error || "Error desconocido al crear compra");
      }
    } catch (err: unknown) {
      let errorMsg = "Error al crear la compra. Revisa los datos.";
      const error = err as { response?: { data?: unknown } };
      if (error.response?.data && typeof error.response.data === "object") {
        const backendError = error.response.data as Record<string, unknown>;
        const fieldErrors = Object.entries(backendError)
          .map(([field, messages]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : String(messages);
            return `${field}: ${msg}`;
          })
          .join("\n");
        if (fieldErrors) errorMsg = `Errores:\n${fieldErrors}`;
      }
      showAlert("Error", "error", { description: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (submitting) return;
    const hasData = formData.proveedor_id !== 0 || formData.detalles.length > 0 || (formData.observaciones?.trim() ?? "").length > 0;
    if (hasData) {
      const confirmar = await confirm("Confirmar Cancelación", "¿Seguro que deseas cancelar? Se perderán los datos ingresados.", "warning");
      if (!confirmar) return;
    }
    navigate("/compras/lista");
  };

  if (loadingProveedores || loadingProductos) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-primary-600 font-medium">Cargando catálogos...</p>
        </div>
      </div>
    );
  }

  if (errorProveedores || errorProductos) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-danger-100 shadow-sm">
          <IconAlertCircle size={48} className="text-danger-500 mb-4" />
          <h2 className="text-xl font-bold text-primary-900 mb-2">Error al cargar datos</h2>
          <p className="text-primary-600 mb-6">{errorProveedores || errorProductos}</p>
          <div className="flex gap-3">
            <Button onClick={() => { fetchProveedores(); fetchProductos(); }}>Reintentar</Button>
            <Button variant="secondary" onClick={() => navigate("/compras/lista")}>Volver</Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (proveedores.length === 0 || productos.length === 0) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-warning-100 shadow-sm">
          <IconBulb size={48} className="text-warning-500 mb-4" />
          <h2 className="text-xl font-bold text-primary-900 mb-2">Datos incompletos</h2>
          <p className="text-primary-600 mb-8 max-w-sm">
            {proveedores.length === 0 && "No hay proveedores registrados. "}
            {productos.length === 0 && "No hay productos registrados. "}
            Debes tener al menos un proveedor y un producto creados.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            {proveedores.length === 0 && <Button className="flex-1" onClick={() => navigate("/proveedores/crear")}>Crear Proveedor</Button>}
            {productos.length === 0 && <Button className="flex-1" onClick={() => navigate("/productos/crear")}>Crear Producto</Button>}
            <Button variant="secondary" onClick={() => navigate("/compras/lista")} className="flex-1">Volver</Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Nueva Compra"
        subtitle="Registra una compra de proveedor"
        icon={<IconShoppingCart size={24} />}
        backButton={
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancel}
            className="p-2 h-10 w-10 flex items-center justify-center rounded-xl"
            disabled={submitting}
          >
            <IconArrowLeft size={20} />
          </Button>
        }
      />

      {!isCajaAbierta && (
        <Card className="border-danger-100 bg-danger-50/30 overflow-hidden animate-in fade-in zoom-in-95 duration-500 mb-6">
          <Card.Content className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-danger-100 flex items-center justify-center text-danger-600 mb-6 shadow-sm border border-danger-200">
              <IconLock size={40} />
            </div>
            <h2 className="text-2xl font-black text-danger-900 mb-3 tracking-tight">Caja Cerrada</h2>
            <p className="text-danger-800/80 mb-8 max-w-md font-medium">
              Para registrar nuevas compras es necesario tener una sesión de caja abierta.
              Esto es requerido para el control financiero.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <Link to="/caja" className="flex-1">
                <Button className="w-full shadow-lg shadow-danger-200" variant="danger">
                  Ir a Caja
                </Button>
              </Link>
              <Button variant="secondary" className="flex-1" onClick={handleCancel}>
                Volver
              </Button>
            </div>
          </Card.Content>
        </Card>
      )}

      {isCajaAbierta && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CompraForm
            mode="create"
            value={formData}
            proveedores={proveedores}
            productos={productos}
            submitting={submitting}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />

          <div className="p-5 bg-primary-50/50 border border-primary-100 rounded-2xl flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0 shadow-sm border border-primary-200">
              <IconBulb size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary-900 mb-1 uppercase tracking-wider">💡 Sugerencias</h3>
              <ul className="text-xs text-primary-800 space-y-1.5 list-disc list-inside font-medium opacity-90">
                <li>Selecciona primero el proveedor para habilitar la búsqueda de productos.</li>
                <li>El total se recalcula al modificar cantidades o precios.</li>
                <li>La fecha de registro no puede ser posterior al día de hoy.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

