/**
 * 📄 PÁGINA: CompraEdit (VERSIÓN CORREGIDA Y ROBUSTA)
 *
 * Página para editar una compra existente
 *
 * MEJORAS IMPLEMENTADAS:
 * ✅ Carga secuencial: catálogos → compra
 * ✅ Loading states consistentes
 * ✅ Manejo robusto de errores tipado
 * ✅ Validaciones del lado del cliente
 * ✅ Feedback claro al usuario
 *
 * FLUJO:
 * 1. Carga proveedores y productos al montar
 * 2. Espera a que terminen de cargar
 * 3. Carga compra por ID
 * 4. Mapea datos a formato del formulario (UI)
 * 5. Usuario edita
 * 6. Valida datos del lado del cliente
 * 7. Convierte a formato API
 * 8. Envía al backend
 * 9. Recarga lista
 * 10. Redirige
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui";
import { useCompras } from "../hooks/useCompras";
import { CompraForm, type CompraFormData } from "../components/CompraForm";
import type { CompraUpdateInput } from "../types";
import { useProveedor } from "@/modules/proveedores/hooks/useProveedor";
import { useProductos } from "@/modules/productos/hooks/useProductos"
import { useAlert } from "@/components/alerts";

export default function CompraEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getCompra, updateCompra, fetchCompras, error } = useCompras();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  // Estado del formulario (UI)
  const [formData, setFormData] = useState<CompraFormData | null>(null);

  /**
   * ✅ PASO 1: CARGAR CATÁLOGOS AL MONTAR
   * Proveedores y productos deben cargarse PRIMERO
   */
  useEffect(() => {
    console.log("🔄 [CompraEdit] Cargando catálogos...");

    fetchProveedores().catch((err) => {
      console.error("❌ Error cargando proveedores:", err);
    });

    fetchProductos().catch((err) => {
      console.error("❌ Error cargando productos:", err);
    });
  }, [fetchProveedores, fetchProductos]);

  /**
   * ✅ PASO 2: CARGAR COMPRA DESPUÉS DE QUE LOS CATÁLOGOS ESTÉN LISTOS
   * Esto asegura que los dropdowns tengan opciones cuando se mapeen los datos
   */
  useEffect(() => {
    if (!id) return;
    if (loadingProveedores || loadingProductos) return;

    const loadCompra = async () => {
      try {
        console.log(`🔍 Cargando compra con ID: ${id}`);

        const compra = await getCompra(Number(id));

        console.log("📦 Compra recibida:", compra);
        console.log("📦 Proveedor ID (correcto):", compra.proveedor_id);

        // ✅ MAPEO CORREGIDO - usar "proveedor_id" en lugar de "proveedor"
        const mappedData: CompraFormData = {
          proveedor_id: Number(compra.proveedor) || 0, // 👈 CAMBIO AQUÍ
          fecha: compra.fecha,
          observaciones: compra.observaciones || "",
          estado: compra.estado,
          total: parseFloat(compra.total.toString()) || 0,
          detalles: (compra.detalles || []).map((d) => {
            console.log("  📦 Mapeando detalle:", {
              producto: d.producto,
              cantidad: d.cantidad,
              precio_compra: d.precio_compra,
            });

            return {
              producto: Number(d.producto), // 👈 También sin _id
              cantidad: Number(d.cantidad),
              precio_unitario: Number(d.precio_compra),
              subtotal: Number(d.cantidad) * Number(d.precio_compra),
            };
          }),
        };

        console.log("✅ Datos mapeados correctamente:", mappedData);

        setFormData(mappedData);
      } catch (err) {
        console.error("❌ Error al cargar la compra:", err);
        showAlert("Error", "error", {
          description: `Error al cargar la compra: ${err instanceof Error ? err.message : "Error desconocido"}`
        });
        navigate("/compras");
      } finally {
        setLoading(false);
      }
    };

    loadCompra();
  }, [id, getCompra, navigate, loadingProveedores, loadingProductos, showAlert]);

  /**
   * ✅ Validaciones del lado del cliente
   */
  const validateForm = (): { valid: boolean; message?: string } => {
    if (!formData) {
      return { valid: false, message: "No hay datos para validar" };
    }

    // Validar proveedor
    if (!formData.proveedor_id || formData.proveedor_id === 0) {
      return { valid: false, message: "Debes seleccionar un proveedor" };
    }

    // Validar fecha
    if (!formData.fecha) {
      return { valid: false, message: "La fecha es obligatoria" };
    }

    // Validar que tenga al menos un producto
    if (formData.detalles.length === 0) {
      return { valid: false, message: "Debes tener al menos un producto" };
    }

    // Validar cada detalle
    for (let i = 0; i < formData.detalles.length; i++) {
      const detalle = formData.detalles[i];

      if (!detalle.producto || detalle.producto === 0) {
        return {
          valid: false,
          message: `Producto #${i + 1}: Debes seleccionar un producto`,
        };
      }

      if (!detalle.cantidad || detalle.cantidad <= 0) {
        return {
          valid: false,
          message: `Producto #${i + 1}: La cantidad debe ser mayor a 0`,
        };
      }

      if (!detalle.precio_unitario || detalle.precio_unitario <= 0) {
        return {
          valid: false,
          message: `Producto #${i + 1}: El precio debe ser mayor a 0`,
        };
      }
    }

    return { valid: true };
  };

  /**
   * Convierte datos del formulario a formato del backend
   */
  const convertToAPIFormat = (data: CompraFormData): CompraUpdateInput => {
    return {
      proveedor_id: data.proveedor_id,
      fecha: data.fecha,
      observaciones: data.observaciones?.trim() || undefined,
      estado: data.estado,
      detalles: data.detalles.map((d) => ({
        producto_id: d.producto,
        cantidad: d.cantidad,
        precio_compra: d.precio_unitario,
      })),
    };
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async () => {
    if (!id || !formData) return;

    console.log("✏️ [CompraEdit] Iniciando actualización...");

    // Validar primero
    const validation = validateForm();
    if (!validation.valid) {
      showAlert("Validación", "warning", { description: validation.message });
      return;
    }

    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(formData);
      console.log("📡 Datos a enviar al backend:", apiData);

      const success = await updateCompra(Number(id), apiData);

      if (success) {
        console.log("✅ Compra actualizada correctamente");

        // CRÍTICO: Recargar la lista de compras
        console.log("🔄 Recargando lista de compras...");
        await fetchCompras();

        showAlert("¡Compra Actualizada!", "success", { description: "Los datos de la compra se han actualizado correctamente." });
        navigate("/compras");
      } else {
        throw new Error(error || "Error desconocido al actualizar compra");
      }
    } catch (err) {
      console.error("❌ Error al actualizar compra:", err);
      showAlert("Error", "error", {
        description: "Error al actualizar la compra. Revisa los datos e intenta nuevamente."
      });
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Maneja cancelación
   */
  const handleCancel = () => {
    if (submitting) return;
    navigate("/compras");
  };

  /**
   * 🔄 Mostrar loading mientras se cargan los catálogos
   */
  if (loadingProveedores || loadingProductos) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando catálogos...</p>
          <p className="text-sm text-gray-500 mt-2">
            {loadingProveedores && "Cargando proveedores... "}
            {loadingProductos && "Cargando productos..."}
          </p>
        </div>
      </div>
    );
  }

  /**
   * ❌ Mostrar error si no se pudieron cargar los catálogos
   */

  if (errorProveedores || errorProductos) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Error al cargar datos
            </h2>
            <p className="text-gray-600 mb-4">
              {errorProveedores || errorProductos}
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  fetchProveedores();
                  fetchProductos();
                }}
              >
                Reintentar
              </Button>
              <Button variant="secondary" onClick={() => navigate("/compras")}>
                Volver al listado
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 🔄 Mostrar loading mientras se carga la compra
   */
  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando compra...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Editar Compra</h1>
          <p className="text-gray-600 mt-1">
            Modifica la información de la compra seleccionada
          </p>
        </div>
      </div>

      {/* Formulario */}
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
        onCancel={handleCancel}
      />

      {/* Advertencia */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-semibold text-yellow-900 mb-2">
          ⚠️ Importante
        </h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>
            Los cambios afectarán el inventario si está configurado en el
            backend
          </li>
          <li>Asegúrate de verificar las cantidades antes de guardar</li>
          <li>
            Si cambias productos, el stock anterior no se revierte
            automáticamente
          </li>
        </ul>
      </div>
    </div>
  );
}
