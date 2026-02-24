/**
 * 📝 COMPONENTE: VentaForm
 *
 * Formulario reutilizable para crear y editar ventas.
 * Mismo patrón que CompraForm.tsx pero adaptado al dominio de ventas.
 *
 * CARACTERÍSTICAS:
 * - Create / Edit
 * - Selección de cliente con búsqueda en tiempo real
 * - Agregar/quitar productos del carrito
 * - Cálculo automático de subtotales y total
 * - Validación clara con alertas
 * - Validación de stock disponible
 */

import { useState, useEffect, useRef } from "react";
import { Card, Button, Input } from "@/components/ui";
import { formatCurrency } from "@/utils/formatters";
import { clientesVentaAPI, productosVentaAPI } from "../api/ventas.api";
import type {
  VentaFormData,
  ClienteParaVenta,
  ProductoParaVenta,
  EstadoVenta,
} from "../types/venta.types";

interface VentaFormProps {
  value: VentaFormData;

  // Catálogos (para edición - se pre-cargan)
  clienteInicial?: ClienteParaVenta | null;

  // Estados
  submitting?: boolean;
  error?: string | null;

  // Modo
  mode?: "create" | "edit";

  // Eventos
  onChange: (data: VentaFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function VentaForm({
  value,
  clienteInicial = null,
  submitting = false,
  error,
  mode = "create",
  onChange,
  onSubmit,
  onCancel,
}: VentaFormProps) {
  // ─── Estado búsqueda de cliente ────────────────────────────────────────
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<ClienteParaVenta | null>(clienteInicial);
  const [busquedaCliente, setBusquedaCliente] = useState(
    clienteInicial?.nombre ?? "",
  );
  const [resultadosCliente, setResultadosCliente] = useState<
    ClienteParaVenta[]
  >([]);
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [mostrarDropdownCliente, setMostrarDropdownCliente] = useState(false);
  const timeoutCliente = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Estado búsqueda de producto ───────────────────────────────────────
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [resultadosProducto, setResultadosProducto] = useState<
    ProductoParaVenta[]
  >([]);
  const [buscandoProducto, setBuscandoProducto] = useState(false);
  const [mostrarDropdownProducto, setMostrarDropdownProducto] = useState(false);
  const timeoutProducto = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Buscar clientes (debounce 300ms) ──────────────────────────────────
  useEffect(() => {
    if (!busquedaCliente.trim() || clienteSeleccionado) {
      setResultadosCliente([]);
      setMostrarDropdownCliente(false);
      return;
    }

    if (timeoutCliente.current) clearTimeout(timeoutCliente.current);

    timeoutCliente.current = setTimeout(async () => {
      setBuscandoCliente(true);
      try {
        const data = await clientesVentaAPI.buscarClientes(busquedaCliente);
        setResultadosCliente(data);
        setMostrarDropdownCliente(true);
      } catch {
        setResultadosCliente([]);
      } finally {
        setBuscandoCliente(false);
      }
    }, 300);

    return () => {
      if (timeoutCliente.current) clearTimeout(timeoutCliente.current);
    };
  }, [busquedaCliente, clienteSeleccionado]);

  // ─── Buscar productos (debounce 300ms) ─────────────────────────────────
  useEffect(() => {
    if (!busquedaProducto.trim()) {
      setResultadosProducto([]);
      setMostrarDropdownProducto(false);
      return;
    }

    if (timeoutProducto.current) clearTimeout(timeoutProducto.current);

    timeoutProducto.current = setTimeout(async () => {
      setBuscandoProducto(true);
      try {
        const data = await productosVentaAPI.buscarProductos(busquedaProducto);
        setResultadosProducto(data);
        setMostrarDropdownProducto(true);
      } catch {
        setResultadosProducto([]);
      } finally {
        setBuscandoProducto(false);
      }
    }, 300);

    return () => {
      if (timeoutProducto.current) clearTimeout(timeoutProducto.current);
    };
  }, [busquedaProducto]);

  // ─── Seleccionar cliente ───────────────────────────────────────────────
  const seleccionarCliente = (cliente: ClienteParaVenta) => {
    setClienteSeleccionado(cliente);
    setBusquedaCliente(cliente.nombre);
    setMostrarDropdownCliente(false);
    setResultadosCliente([]);
    onChange({ ...value, cliente_id: cliente.id });
  };

  const limpiarCliente = () => {
    setClienteSeleccionado(null);
    setBusquedaCliente("");
    onChange({ ...value, cliente_id: 0 });
  };

  // ─── Agregar producto al carrito ───────────────────────────────────────
  const agregarProducto = (producto: ProductoParaVenta) => {
    // Si ya está en el carrito, incrementar cantidad
    const indexExistente = value.detalles.findIndex(
      (d) => d.producto_id === producto.id,
    );

    let nuevosDetalles;

    if (indexExistente >= 0) {
      nuevosDetalles = [...value.detalles];
      const detalle = nuevosDetalles[indexExistente];
      const nuevaCantidad = detalle.cantidad + 1;

      if (nuevaCantidad > producto.stock_actual) {
        alert(
          `Stock insuficiente. Solo hay ${producto.stock_actual} unidades.`,
        );
        return;
      }

      nuevosDetalles[indexExistente] = {
        ...detalle,
        cantidad: nuevaCantidad,
        subtotal: nuevaCantidad * detalle.precio_unitario,
      };
    } else {
      if (producto.stock_actual <= 0) {
        alert("Este producto no tiene stock disponible.");
        return;
      }

      nuevosDetalles = [
        ...value.detalles,
        {
          producto_id: producto.id,
          producto_codigo: producto.codigo,
          producto_nombre: producto.nombre,
          stock_disponible: producto.stock_actual,
          cantidad: 1,
          precio_unitario: producto.precio_venta,
          subtotal: producto.precio_venta,
        },
      ];
    }

    setBusquedaProducto("");
    setMostrarDropdownProducto(false);

    onChange({
      ...value,
      detalles: nuevosDetalles,
      total: calcularTotal(nuevosDetalles),
    });
  };

  // ─── Eliminar detalle ──────────────────────────────────────────────────
  const removeDetalle = (index: number) => {
    const nuevosDetalles = value.detalles.filter((_, i) => i !== index);
    onChange({
      ...value,
      detalles: nuevosDetalles,
      total: calcularTotal(nuevosDetalles),
    });
  };

  // ─── Actualizar campo de detalle ──────────────────────────────────────
  const updateDetalle = (
    index: number,
    field: "cantidad" | "precio_unitario",
    newValue: number,
  ) => {
    const detalles = [...value.detalles];
    const detalle = { ...detalles[index], [field]: newValue };

    // Validar stock
    if (field === "cantidad" && newValue > detalle.stock_disponible) {
      alert(
        `Stock insuficiente. Solo hay ${detalle.stock_disponible} unidades.`,
      );
      return;
    }

    detalle.subtotal = detalle.cantidad * detalle.precio_unitario;
    detalles[index] = detalle;

    onChange({
      ...value,
      detalles,
      total: calcularTotal(detalles),
    });
  };

  // ─── Calcular total ────────────────────────────────────────────────────
  const calcularTotal = (detalles: VentaFormData["detalles"]) =>
    detalles.reduce((sum, d) => sum + d.subtotal, 0);

  // ─── Validación ────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    if (!value.cliente_id || value.cliente_id === 0) {
      alert("Debes seleccionar un cliente");
      return false;
    }

    if (value.detalles.length === 0) {
      alert("Debes agregar al menos un producto");
      return false;
    }

    for (let i = 0; i < value.detalles.length; i++) {
      const d = value.detalles[i];
      if (d.cantidad <= 0) {
        alert(`Producto #${i + 1}: La cantidad debe ser mayor a 0`);
        return false;
      }
      if (d.precio_unitario <= 0) {
        alert(`Producto #${i + 1}: El precio debe ser mayor a 0`);
        return false;
      }
    }

    return true;
  };

  // ─── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit();
  };

  return (
    <Card>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error global */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* ── Sección: Cliente ─────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Cliente</h3>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Buscar cliente <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={busquedaCliente}
                  onChange={(e) => {
                    setBusquedaCliente(e.target.value);
                    if (clienteSeleccionado) limpiarCliente();
                  }}
                  disabled={submitting}
                  placeholder="Escribe el nombre o documento del cliente..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                           disabled:bg-gray-50 transition-all"
                />
                {clienteSeleccionado && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={limpiarCliente}
                  >
                    ✕ Cambiar
                  </Button>
                )}
              </div>

              {/* Badge del cliente seleccionado */}
              {clienteSeleccionado && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    ✓ {clienteSeleccionado.nombre}
                  </p>
                  {clienteSeleccionado.documento && (
                    <p className="text-xs text-blue-700 mt-0.5">
                      Doc: {clienteSeleccionado.documento}
                    </p>
                  )}
                  {clienteSeleccionado.telefono && (
                    <p className="text-xs text-blue-700">
                      Tel: {clienteSeleccionado.telefono}
                    </p>
                  )}
                </div>
              )}

              {/* Dropdown clientes */}
              {mostrarDropdownCliente && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                  {buscandoCliente ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      Buscando...
                    </div>
                  ) : resultadosCliente.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      No se encontraron clientes
                    </div>
                  ) : (
                    resultadosCliente.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => seleccionarCliente(c)}
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50
                                 border-b last:border-none transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {c.nombre}
                        </p>
                        {c.documento && (
                          <p className="text-xs text-gray-500">
                            Doc: {c.documento}
                          </p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Estado (solo en edit) */}
            {mode === "edit" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  value={value.estado ?? "PENDIENTE"}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      estado: e.target.value as EstadoVenta,
                    })
                  }
                  disabled={submitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="COMPLETADA">Completada</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
              </div>
            )}
          </div>

          {/* ── Sección: Productos ───────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Productos</h3>

            {/* Buscador de productos */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Buscar y agregar producto
              </label>
              <input
                type="text"
                value={busquedaProducto}
                onChange={(e) => setBusquedaProducto(e.target.value)}
                disabled={submitting}
                placeholder="Escribe el nombre o código del producto..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                         disabled:bg-gray-50 transition-all"
              />

              {/* Dropdown productos */}
              {mostrarDropdownProducto && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {buscandoProducto ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      Buscando...
                    </div>
                  ) : resultadosProducto.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      No se encontraron productos
                    </div>
                  ) : (
                    resultadosProducto.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => agregarProducto(p)}
                        disabled={p.stock_actual <= 0}
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50
                                 border-b last:border-none transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {p.nombre}
                            </p>
                            <p className="text-xs text-gray-500">
                              Código: {p.codigo} · Stock: {p.stock_actual}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-blue-700">
                            {formatCurrency(p.precio_venta)}
                          </span>
                        </div>
                        {p.stock_actual <= 0 && (
                          <p className="text-xs text-red-500 mt-0.5">
                            Sin stock
                          </p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Encabezado tabla */}
            {value.detalles.length > 0 && (
              <div
                className="grid grid-cols-6 gap-3 bg-gray-100 px-3 py-2 rounded-lg
                            font-semibold text-sm text-gray-600"
              >
                <div className="col-span-2">Producto</div>
                <div className="text-center">Cantidad</div>
                <div className="text-center">Precio Unit.</div>
                <div className="text-right">Subtotal</div>
                <div></div>
              </div>
            )}

            {/* Filas de detalles */}
            {value.detalles.map((detalle, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-3 items-center bg-white px-3 py-2
                         rounded-lg border border-gray-200 shadow-sm"
              >
                {/* Nombre */}
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-900">
                    {detalle.producto_nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    {detalle.producto_codigo} · Stock:{" "}
                    {detalle.stock_disponible}
                  </p>
                </div>

                {/* Cantidad */}
                <Input
                  label=""
                  type="number"
                  value={detalle.cantidad}
                  onChange={(e) =>
                    updateDetalle(index, "cantidad", Number(e.target.value))
                  }
                  min={1}
                  max={detalle.stock_disponible}
                  disabled={submitting}
                />

                {/* Precio unitario */}
                <Input
                  label=""
                  type="text"
                  value={formatCurrency(detalle.precio_unitario)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    updateDetalle(
                      index,
                      "precio_unitario",
                      Number(rawValue) || 0,
                    );
                  }}
                  disabled={submitting}
                />

                {/* Subtotal */}
                <div className="font-semibold text-right text-green-600 text-sm">
                  {formatCurrency(detalle.subtotal)}
                </div>

                {/* Eliminar */}
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeDetalle(index)}
                  disabled={submitting}
                >
                  ✕
                </Button>
              </div>
            ))}

            {value.detalles.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500 text-sm">
                  Busca y agrega productos a la venta
                </p>
              </div>
            )}
          </div>

          {/* ── Total ────────────────────────────────────────────────── */}
          <div className="flex justify-end">
            <div className="bg-gray-900 text-white px-8 py-4 rounded-xl shadow-lg min-w-[250px] text-right">
              <p className="text-sm uppercase tracking-wide text-gray-300">
                Total de la Venta
              </p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(value.total)}
              </p>
            </div>
          </div>

          {/* ── Acciones ─────────────────────────────────────────────── */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancelar
            </Button>

            <Button type="submit" isLoading={submitting}>
              {mode === "create" ? "Crear Venta" : "Actualizar Venta"}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
