/**
 * 📄 PÁGINA: CompraEdit
 *
 * Página para editar una compra existente
 *
 * FLUJO:
 * 1. Carga compra por ID
 * 2. Mapea datos a formato del formulario (UI)
 * 3. Usuario edita
 * 4. Convierte a formato API
 * 5. Envía al backend
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui";
import { useCompras } from "../hooks/useCompras";
import { CompraForm, type CompraFormData } from "../components/CompraForm";
import type { CompraUpdateInput } from "../types";
import { useProveedor } from "@/modules/proveedores/hooks/useProveedor";
import { useProductos } from "@/modules/inventario/hooks/useProductos";


export default function CompraEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getCompra, updateCompra, error } = useCompras();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { proveedores, loading: loadingProveedores } = useProveedor();
  const { productos, isLoading: loadingProductos } = useProductos();



  // Estado del formulario (UI)
  const [formData, setFormData] = useState<CompraFormData | null>(null);

  /**
   * Carga la compra y la mapea a formato del formulario
   */
  useEffect(() => {
    const loadCompra = async () => {
      if (!id) return;

      try {
        const compra = await getCompra(Number(id));

        const mappedData: CompraFormData = {
          proveedor:
            typeof compra.proveedor === "number"
              ? compra.proveedor
              : compra.proveedor.id,
          fecha: compra.fecha,
          observaciones: compra.observaciones ?? "",
          estado: compra.estado,
          total: compra.total,
          detalles: compra.detalles.map((d) => ({
            producto: d.producto,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
            subtotal: d.cantidad * d.precio_unitario,
          })),
        };


        setFormData(mappedData);
      } finally {
        setLoading(false);
      }
    };

    loadCompra();
  }, [id, getCompra]);

  /**
   * Convierte datos del formulario a formato del backend
   */
  const convertToAPIFormat = (data: CompraFormData): CompraUpdateInput => {
    return {
      proveedor: data.proveedor,
      fecha: data.fecha,
      observaciones: data.observaciones,
      estado: data.estado,
      detalles: data.detalles.map((d) => ({
        producto: d.producto,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
      })),
    };
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async () => {
    if (!id || !formData) return;

    console.log("✏️ Actualizando compra...");
    console.log("📦 Datos del formulario:", formData);

    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(formData);
      console.log("📡 Datos a enviar al backend:", apiData);

      await updateCompra(Number(id), apiData);

      console.log("✅ Compra actualizada correctamente");
      navigate("/compras");
    } catch (err) {
      console.error("❌ Error al actualizar compra:", err);
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

  if (loading || loadingProveedores || loadingProductos || !formData) {
    return <p>Cargando datos de la compra...</p>;
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
    </div>
  );
}
