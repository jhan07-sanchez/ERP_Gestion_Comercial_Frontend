/**
 * 📄 PÁGINA: CompraCreate (VERSIÓN CORREGIDA Y ROBUSTA)
 *
 * Página para crear una nueva compra
 *
 * MEJORAS IMPLEMENTADAS:
 * ✅ Carga de catálogos al montar (proveedores y productos)
 * ✅ Loading states consistentes
 * ✅ Manejo robusto de errores tipado
 * ✅ Validaciones del lado del cliente
 * ✅ Recarga automática de lista después de crear
 * ✅ Feedback claro al usuario
 *
 * FLUJO:
 * 1. Carga proveedores y productos al montar
 * 2. Inicializa estado UI (CompraFormData)
 * 3. Usuario completa formulario
 * 4. Valida datos del lado del cliente
 * 5. Convierte UI → payload backend
 * 6. Envía al backend
 * 7. Recarga lista de compras
 * 8. Redirige al listado
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";

import { CompraForm, type CompraFormData } from "../components/CompraForm";
import { useCompras } from "../hooks/useCompras";
import { useProveedor } from "@/modules/proveedores/hooks/useProveedor";
import { useProductos } from "@/modules/inventario/hooks/useProductos";

export default function CompraCreate() {
  const navigate = useNavigate();

  // Hooks de dominio
  const { createCompra, fetchCompras, error } = useCompras();
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

  /**
   * 🧠 Estado inicial del formulario (UI ONLY)
   */
  const [formData, setFormData] = useState<CompraFormData>({
    proveedor_id: 0,
    fecha: new Date().toISOString().split("T")[0],
    observaciones: "",
    detalles: [],
    total: 0,
  });

  /**
   * ✅ CARGA DE CATÁLOGOS AL MONTAR
   * CRÍTICO: Sin esto, los dropdowns estarán vacíos
   */
  useEffect(() => {
    console.log("🔄 [CompraCreate] Cargando catálogos...");

    // Cargar proveedores
    fetchProveedores().catch((err) => {
      console.error("❌ Error cargando proveedores:", err);
    });

    // Cargar productos
    fetchProductos().catch((err) => {
      console.error("❌ Error cargando productos:", err);
    });
  }, [fetchProveedores, fetchProductos]);

  /**
   * 📊 Log para debug - puedes quitarlo en producción
   */
  useEffect(() => {
    console.log("📦 Proveedores disponibles:", proveedores.length);
    console.log("📦 Productos disponibles:", productos.length);
  }, [proveedores, productos]);

  /**
   * ✅ Validaciones del lado del cliente
   */
  const validateForm = (): { valid: boolean; message?: string } => {
    // Validar proveedor
    if (!formData.proveedor_id || formData.proveedor_id === 0) {
      return { valid: false, message: "Debes seleccionar un proveedor" };
    }

    // Validar fecha
    if (!formData.fecha) {
      return { valid: false, message: "La fecha es obligatoria" };
    }

    // Validar que no sea fecha futura
    const fechaCompra = new Date(formData.fecha);
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    if (fechaCompra > hoy) {
      return { valid: false, message: "La fecha no puede ser futura" };
    }

    // Validar que tenga al menos un producto
    if (formData.detalles.length === 0) {
      return { valid: false, message: "Debes agregar al menos un producto" };
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

    // Validar que el total sea mayor a 0
    if (formData.total <= 0) {
      return { valid: false, message: "El total debe ser mayor a 0" };
    }

    return { valid: true };
  };

  /**
   * 🔁 Convierte datos UI → formato backend
   */
  const convertToAPIFormat = (data: CompraFormData) => {
    return {
      proveedor_id: data.proveedor_id,
      fecha: data.fecha,
      observaciones: data.observaciones?.trim() || undefined,
      detalles: data.detalles.map((d) => ({
        producto_id: d.producto,
        cantidad: d.cantidad,
        precio_compra: d.precio_unitario,
      })),
    };
  };

  /**
   * 🚀 Envío del formulario
   */
  const handleSubmit = async () => {
    console.log("📋 [CompraCreate] Iniciando envío...");

    // Validar primero
    const validation = validateForm();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(formData);

      console.log("📡 Payload enviado al backend:", apiData);

      // Crear compra
      const success = await createCompra(apiData);

      if (success) {
        console.log("✅ Compra creada exitosamente");

        // CRÍTICO: Recargar la lista de compras
        console.log("🔄 Recargando lista de compras...");
        await fetchCompras();

        alert("¡Compra registrada exitosamente!");

        // Redirigir con un pequeño delay para que el usuario vea el mensaje
        setTimeout(() => {
          navigate("/compras");
        }, 500);
      } else {
        throw new Error(error || "Error desconocido al crear compra");
      }
    } catch (err) {
      console.error("❌ ERROR:", err);

      const error = err as {
        response?: { status?: number; data?: unknown };
        message?: string;
      };

      console.error("❌ ERROR DEL BACKEND:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Construir mensaje de error amigable
      let errorMsg = "Error al crear la compra. Revisa los datos.";

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

  /**
   * ❌ Cancelar
   */
  const handleCancel = () => {
    if (submitting) return;

    const hasData =
      formData.proveedor_id !== 0 ||
      formData.detalles.length > 0 ||
      (formData.observaciones?.trim() ?? "").length > 0;

    if (hasData) {
      const confirmar = window.confirm(
        "¿Seguro que deseas cancelar? Se perderán los datos ingresados.",
      );
      if (!confirmar) return;
    }

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
          <p className="mt-4 text-gray-600">Cargando datos...</p>
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
   * ⚠️ Advertencia si no hay proveedores o productos
   */
  if (proveedores.length === 0 || productos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-yellow-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Datos incompletos
            </h2>
            <p className="text-gray-600 mb-4">
              {proveedores.length === 0 && "No hay proveedores registrados. "}
              {productos.length === 0 && "No hay productos registrados. "}
              Debes crear al menos un proveedor y un producto antes de registrar
              compras.
            </p>
            <div className="space-y-2">
              {proveedores.length === 0 && (
                <Button onClick={() => navigate("/proveedores/crear")}>
                  Crear Proveedor
                </Button>
              )}
              {productos.length === 0 && (
                <Button onClick={() => navigate("/productos/crear")}>
                  Crear Producto
                </Button>
              )}
              <Button variant="secondary" onClick={() => navigate("/compras")}>
                Volver
              </Button>
            </div>
          </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Nueva Compra</h1>
          <p className="text-gray-600 mt-1">Registra una compra de proveedor</p>
        </div>
      </div>

      {/* Formulario */}
      <CompraForm
        mode="create"
        value={formData}
        proveedores={proveedores}
        productos={productos}
        submitting={submitting}
        error={error}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {/* Nota informativa */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Nota</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Debes seleccionar un proveedor</li>
          <li>Agrega al menos un producto</li>
          <li>El total se calcula automáticamente</li>
          <li>
            La compra impactará el inventario (si está configurado en el
            backend)
          </li>
          <li>La fecha no puede ser futura</li>
        </ul>
      </div>
    </div>
  );
}
