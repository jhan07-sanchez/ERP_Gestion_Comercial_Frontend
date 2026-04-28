import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, PageContainer, PageHeader, Card } from "@/shared/components/ui";
import { useCompras } from "../hooks/useCompras";
import { CompraForm, type CompraFormData } from "../components/CompraForm";
import type { CompraUpdateInput } from "../types";
import { useProveedor } from "@/modules/proveedores/hooks/useProveedor";
import { useProductos } from "@/modules/productos/hooks/useProductos"
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { IconShoppingCart, IconArrowLeft, IconLock, IconAlertTriangle } from "@tabler/icons-react";

export default function CompraEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getCompra, updateCompra, fetchCompras, error } = useCompras();
  const { showAlert } = useAlert();
  const { isCajaAbierta } = useCajaStore();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    proveedores,
    fetchProveedores,
    isLoading: loadingProveedores,
  } = useProveedor();

  const {
    productos,
    fetchProductos,
    isLoading: loadingProductos,
  } = useProductos();

  const [formData, setFormData] = useState<CompraFormData | null>(null);

  useEffect(() => {
    fetchProveedores();
    fetchProductos();
  }, [fetchProveedores, fetchProductos]);

  useEffect(() => {
    if (!id) return;
    if (loadingProveedores || loadingProductos) return;

    const loadCompra = async () => {
      try {
        const compraData = await getCompra(Number(id));
        const mappedData: CompraFormData = {
          proveedor_id: Number(compraData.proveedor) || 0,
          fecha: compraData.fecha,
          observaciones: compraData.observaciones || "",
          estado: compraData.estado,
          total: parseFloat(compraData.total.toString()) || 0,
          detalles: (compraData.detalles || []).map((d) => ({
            producto: Number(d.producto),
            cantidad: Number(d.cantidad),
            precio_unitario: Number(d.precio_compra),
            subtotal: Number(d.cantidad) * Number(d.precio_compra),
          })),
        };
        setFormData(mappedData);
      } catch {
        showAlert("Error", "error", {
          description: "No se pudo cargar la información de la compra."
        });
        navigate("/compras");
      } finally {
        setLoading(false);
      }
    };

    loadCompra();
  }, [id, getCompra, navigate, loadingProveedores, loadingProductos, showAlert]);

  const validateForm = (): { valid: boolean; message?: string } => {
    if (!formData) return { valid: false, message: "No hay datos para validar" };
    if (!formData.proveedor_id) return { valid: false, message: "Debes seleccionar un proveedor" };
    if (!formData.fecha) return { valid: false, message: "La fecha es obligatoria" };
    if (formData.detalles.length === 0) return { valid: false, message: "Debes tener al menos un producto" };
    
    for (let i = 0; i < formData.detalles.length; i++) {
      const detalle = formData.detalles[i];
      if (!detalle.producto) return { valid: false, message: `Producto #${i + 1}: Selecciona un producto` };
      if (detalle.cantidad <= 0) return { valid: false, message: `Producto #${i + 1}: Cantidad > 0` };
      if (detalle.precio_unitario <= 0) return { valid: false, message: `Producto #${i + 1}: Precio > 0` };
    }
    return { valid: true };
  };

  const handleSubmit = async () => {
    if (!id || !formData) return;
    const validation = validateForm();
    if (!validation.valid) {
      showAlert("Validación", "warning", { description: validation.message });
      return;
    }

    setSubmitting(true);
    try {
      const apiData: CompraUpdateInput = {
        proveedor_id: formData.proveedor_id,
        fecha: formData.fecha,
        observaciones: formData.observaciones?.trim() || undefined,
        estado: formData.estado,
        detalles: formData.detalles.map((d) => ({
          producto_id: d.producto,
          cantidad: d.cantidad,
          precio_compra: d.precio_unitario,
        })),
      };

      const success = await updateCompra(Number(id), apiData);
      if (success) {
        await fetchCompras();
        showAlert("¡Compra Actualizada!", "success", { description: "Los datos se han guardado correctamente." });
        navigate("/compras");
      }
    } catch {
      showAlert("Error", "error", { description: "Error al actualizar la compra." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProveedores || loadingProductos || loading || !formData) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-primary-600 font-medium">Cargando información...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Editar Compra"
        subtitle={`Editando compra #${id}`}
        icon={<IconShoppingCart size={24} />}
        backButton={
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate("/compras")}
            className="p-2 h-10 w-10 flex items-center justify-center rounded-xl"
          >
            <IconArrowLeft size={20} />
          </Button>
        }
      />

      {!isCajaAbierta ? (
        <Card className="border-danger-100 bg-danger-50/30">
          <Card.Content className="flex flex-col items-center text-center p-12">
            <div className="p-4 bg-danger-100 rounded-2xl text-danger-600 mb-4">
              <IconLock size={48} />
            </div>
            <h2 className="text-2xl font-black text-primary-900 mb-2">Caja Cerrada</h2>
            <p className="text-primary-600 mb-6 max-w-md">
              Es necesario tener una sesión de caja abierta para poder editar compras y mantener el control financiero.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link to="/caja">
                <Button className="w-full shadow-lg shadow-primary-100">Abrir Caja Ahora</Button>
              </Link>
              <Button variant="secondary" onClick={() => navigate("/compras")}>Cancelar</Button>
            </div>
          </Card.Content>
        </Card>
      ) : (
        <div className="space-y-6">
          <CompraForm
            key={`compra-${formData.proveedor_id}-${formData.detalles.length}`}
            mode="edit"
            value={formData}
            proveedores={proveedores}
            productos={productos}
            submitting={submitting}
            error={error}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/compras")}
          />

          <Card className="bg-warning-50 border-warning-200">
            <Card.Content className="p-4 flex gap-3">
              <IconAlertTriangle className="text-warning-600 shrink-0" size={20} />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-warning-900">Importante</h3>
                <ul className="text-xs text-warning-800 space-y-1 list-disc list-inside opacity-90">
                  <li>Los cambios afectarán directamente el inventario actual.</li>
                  <li>Asegúrate de verificar los precios de costo antes de guardar.</li>
                  <li>Las modificaciones quedan registradas en el historial de auditoría.</li>
                </ul>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
