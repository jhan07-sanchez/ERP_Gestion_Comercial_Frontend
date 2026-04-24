import { useState, useEffect } from "react";
import { Button, Input } from "@/shared/components/ui";
import { IconLoader2, IconCheck, IconX } from "@tabler/icons-react";
import { format } from "date-fns";

import { productosAPI } from "@/modules/productos/api/productos.api";
import { proveedoresAPI } from "@/modules/proveedores/api/proveedores.api";

import type { PrecioDetail } from "../types/precio.types";
import type { ProductoList } from "@/modules/productos/types";
import type { ProveedorList } from "@/modules/proveedores/types/proveedor.types";

interface PrecioFormProps {
  precio?: PrecioDetail;
  isLoading?: boolean;
  error?: string | null;
  onSubmit: (data: {
    producto_id: number;
    proveedor_id: number;
    precio: number;
    fecha_inicio: string;
    fecha_fin: string;
    vigente: boolean;
  }) => Promise<void>;
  onCancel?: () => void;
}

export default function PrecioForm({
  precio,
  isLoading = false,
  error = null,
  onSubmit,
  onCancel,
}: PrecioFormProps) {
  const isEditing = !!precio;

  const formatDatetimeForInput = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "";
    }
  };

  const [formData, setFormData] = useState({
    producto_id: precio?.producto || 0,
    proveedor_id: precio?.proveedor || 0,
    precio: precio?.precio || 0,
    fecha_inicio: formatDatetimeForInput(precio?.fecha_inicio),
    fecha_fin: formatDatetimeForInput(precio?.fecha_fin),
    vigente: precio?.vigente ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 🔍 PRODUCTO STATES
  const [busquedaProducto, setBusquedaProducto] = useState(precio?.producto_info?.nombre || "");
  const [resultadosProducto, setResultadosProducto] = useState<ProductoList[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoList | null>(
    precio?.producto_info ? { id: precio.producto_info.id, nombre: precio.producto_info.nombre, codigo: precio.producto_info.codigo } as ProductoList : null
  );
  const [mostrarDropdownProducto, setMostrarDropdownProducto] = useState(false);

  // 🔍 PROVEEDOR STATES
  const [busquedaProveedor, setBusquedaProveedor] = useState(precio?.proveedor_info?.nombre || "");
  const [resultadosProveedor, setResultadosProveedor] = useState<ProveedorList[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<
    ProveedorList | null
  >(precio?.proveedor_info ? { id: precio.proveedor_info.id, nombre: precio.proveedor_info.nombre, documento: precio.proveedor_info.documento } as ProveedorList : null);
  const [mostrarDropdownProveedor, setMostrarDropdownProveedor] =
    useState(false);

  /**
   * 🔥 BUSCAR PRODUCTOS (debounce)
   */
  useEffect(() => {
    if (!busquedaProducto.trim() || productoSeleccionado) {
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const data = await productosAPI.getProductos({ search: busquedaProducto });
        setResultadosProducto(data.results || []);
        setMostrarDropdownProducto(true);
      } catch {
        setResultadosProducto([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [busquedaProducto, productoSeleccionado]);

  /**
   * 🔥 BUSCAR PROVEEDORES (debounce)
   */
  useEffect(() => {
    if (!busquedaProveedor.trim() || proveedorSeleccionado) {
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const data = await proveedoresAPI.getProveedores({ search: busquedaProveedor });
        setResultadosProveedor(data.results || []);
        setMostrarDropdownProveedor(true);
      } catch {
        setResultadosProveedor([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [busquedaProveedor, proveedorSeleccionado]);

  /**
   * ✅ VALIDACIÓN
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.producto_id) {
      newErrors.producto_id = "Selecciona un producto";
    }

    if (!formData.proveedor_id) {
      newErrors.proveedor_id = "Selecciona un proveedor";
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = "La fecha es requerida";
    }

    if (formData.fecha_inicio && formData.fecha_fin) {
      const inicio = new Date(formData.fecha_inicio);
      const fin = new Date(formData.fecha_fin);

      if (fin < inicio) {
        newErrors.fecha_fin = "La fecha fin debe ser mayor";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 🚀 SUBMIT
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
        precio: Number(formData.precio),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al guardar";
      setSubmitError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(submitError || error) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <IconX size={18} className="text-red-600" />
          <p className="text-sm text-red-600">{submitError || error}</p>
        </div>
      )}

      {/* 🔍 PRODUCTO */}
      <div className="relative">
        <label className="text-sm font-bold">Producto *</label>
        <Input
          placeholder="Buscar producto..."
          value={productoSeleccionado?.nombre || busquedaProducto}
          disabled={isEditing}
          onChange={(e) => {
            const value = e.target.value;
            setBusquedaProducto(value);
            setProductoSeleccionado(null);
            if (!value.trim()) {
              setResultadosProducto([]);
              setMostrarDropdownProducto(false);
            }
          }}
        />

        {mostrarDropdownProducto && (
          <div className="absolute bg-white border w-full z-10">
            {resultadosProducto.map((p) => (
              <div
                key={p.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setProductoSeleccionado(p);
                  setFormData((prev) => ({
                    ...prev,
                    producto_id: p.id,
                  }));
                  setMostrarDropdownProducto(false);
                  setResultadosProducto([]);
                }}
              >
                {p.nombre}
              </div>
            ))}
          </div>
        )}

        {errors.producto_id && (
          <p className="text-red-600 text-xs">{errors.producto_id}</p>
        )}
      </div>

      {/* 🔍 PROVEEDOR */}
      <div className="relative">
        <label className="text-sm font-bold">Proveedor *</label>
        <Input
          placeholder="Buscar proveedor..."
          value={proveedorSeleccionado?.nombre || busquedaProveedor}
          disabled={isEditing}
          onChange={(e) => {
            const value = e.target.value;
            setBusquedaProveedor(value);
            setProveedorSeleccionado(null);
            if (!value.trim()) {
              setResultadosProveedor([]);
              setMostrarDropdownProveedor(false);
            }
          }}
        />

        {mostrarDropdownProveedor && (
          <div className="absolute bg-white border w-full z-10">
            {resultadosProveedor.map((p) => (
              <div
                key={p.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setProveedorSeleccionado(p);
                  setFormData((prev) => ({
                    ...prev,
                    proveedor_id: p.id,
                  }));
                  setMostrarDropdownProveedor(false);
                  setResultadosProveedor([]);
                }}
              >
                {p.nombre}
              </div>
            ))}
          </div>
        )}

        {errors.proveedor_id && (
          <p className="text-red-600 text-xs">{errors.proveedor_id}</p>
        )}
      </div>

      {/* 💰 PRECIO */}
      <div>
        <label className="text-sm font-bold">Precio *</label>
        <Input
          name="precio"
          type="number"
          value={formData.precio}
          onChange={(e) =>
            setFormData({ ...formData, precio: Number(e.target.value) })
          }
        />
        {errors.precio && (
          <p className="text-red-600 text-xs">{errors.precio}</p>
        )}
      </div>

      {/* 📅 FECHA INICIO */}
      <div>
        <label className="text-sm font-bold">Fecha Inicio *</label>
        <Input
          type="datetime-local"
          value={formData.fecha_inicio}
          onChange={(e) =>
            setFormData({ ...formData, fecha_inicio: e.target.value })
          }
        />
      </div>

      {/* 📅 FECHA FIN */}
      <div>
        <label className="text-sm font-bold">Fecha Fin</label>
        <Input
          type="datetime-local"
          value={formData.fecha_fin}
          onChange={(e) =>
            setFormData({ ...formData, fecha_fin: e.target.value })
          }
        />
      </div>

      {/* ✅ ESTADO */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.vigente}
          onChange={(e) =>
            setFormData({ ...formData, vigente: e.target.checked })
          }
        />
        <label>Precio vigente</label>
      </div>

      {/* BOTONES */}
      <div className="flex gap-3">
        <Button type="button" onClick={onCancel}>
          Cancelar
        </Button>

        <Button
          type="submit"
          leftIcon={
            isLoading ? <IconLoader2 className="animate-spin" /> : <IconCheck />
          }
        >
          {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  );
}
