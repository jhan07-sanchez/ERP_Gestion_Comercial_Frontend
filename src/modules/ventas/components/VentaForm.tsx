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

import { useState } from "react";
import { Card, Button, Badge } from "@shared/components/ui";
import { formatCurrency, formatNumberInput, parseNumberInput, numberClass } from "@shared/utils/formatters";
import {
  IconUser,
  IconSearch,
  IconPackage,
  IconTrash,
  IconPlus,
  IconMinus,
  IconShoppingCart,
  IconCheck,
  IconChevronRight
} from "@tabler/icons-react";
import { clientesVentaAPI, productosVentaAPI } from "@modules/ventas/api/ventas.api";
import { useAlert } from "@shared/components/alerts";
import { useDebounceSearch } from "@shared/hooks";
import { useConfiguracion } from "@modules/configuracion/hooks/useConfiguracion";
import { useConfigStore } from "@shared/store/config.store";
import type {
  VentaFormData,
  ClienteParaVenta,
  ProductoParaVenta,
} from "@modules/ventas/types/venta.types";
import { VentaFormResumen } from "./venta-form/VentaFormResumen";

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
  onSubmit: (data?: VentaFormData) => void;
  onCancel: () => void;
}

export function VentaForm({
  value,
  clienteInicial = null,
  submitting = false,
  onChange,
  onSubmit,
  onCancel,
}: VentaFormProps) {
  const { showAlert } = useAlert();
  const { config } = useConfiguracion();
  const { getImpuesto, getSimbolo, getMoneda, getPermitirVentaSinStock } = useConfigStore();

  const simbolo = getSimbolo();
  const moneda = getMoneda();
  const impuestoPorcentaje = getImpuesto();
  const permitirVentaSinStock = getPermitirVentaSinStock();
  // ─── Estado búsqueda de cliente ────────────────────────────────────────
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<ClienteParaVenta | null>(clienteInicial);

  const {
    results: resultadosCliente,
    isSearching: buscandoCliente,
    searchTerm: busquedaCliente,
    setSearchTerm: setBusquedaCliente,
    showDropdown: mostrarDropdownCliente,
    clear: clearBusquedaCliente,
  } = useDebounceSearch<ClienteParaVenta>({
    searchFn: clientesVentaAPI.buscarClientes,
    debounceMs: 300,
  });

  // ─── Estado búsqueda de producto ───────────────────────────────────────
  const {
    results: resultadosProducto,
    isSearching: buscandoProducto,
    searchTerm: busquedaProducto,
    setSearchTerm: setBusquedaProducto,
    showDropdown: mostrarDropdownProducto,
    clear: clearBusquedaProducto,
  } = useDebounceSearch<ProductoParaVenta>({
    searchFn: productosVentaAPI.buscarProductos,
    debounceMs: 300,
  });

  // ─── Seleccionar cliente ───────────────────────────────────────────────
  const seleccionarCliente = (cliente: ClienteParaVenta) => {
    setClienteSeleccionado(cliente);
    setBusquedaCliente(cliente.nombre);
    clearBusquedaCliente();
    setBusquedaCliente(cliente.nombre);
    onChange({ ...value, cliente_id: cliente.id });
  };

  const limpiarCliente = () => {
    setClienteSeleccionado(null);
    clearBusquedaCliente();
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
      const nuevaCantidad = Number(detalle.cantidad) + 1;

      if (nuevaCantidad > producto.stock_actual && !permitirVentaSinStock) {
        showAlert("Stock Insuficiente", "warning", {
          description: `Solo hay ${producto.stock_actual} unidades de ${producto.nombre} y la política global prohíbe ventas sin stock.`
        });
        return;
      }

      nuevosDetalles[indexExistente] = {
        ...detalle,
        cantidad: nuevaCantidad,
        subtotal: nuevaCantidad * Number(detalle.precio_unitario),
      };
    } else {
      if (producto.stock_actual <= 0 && !permitirVentaSinStock) {
        showAlert("Sin Stock", "warning", { description: "Este producto no tiene stock disponible y la política global bloquea la venta." });
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

    clearBusquedaProducto();

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

  // ─── Calcular total ────────────────────────────────────────────────────
  const calcularTotal = (detalles: VentaFormData["detalles"]): number => {
    const total = detalles.reduce((sum, d) => sum + (Number(d.subtotal) || 0), 0);
    return isNaN(total) ? 0 : total;
  };

  // ─── Actualizar campo de detalle ──────────────────────────────────────
  const updateDetalle = (
    index: number,
    field: "cantidad" | "precio_unitario",
    newValue: number | string,
  ) => {
    const detalles = [...value.detalles];
    let processedValue: number | "";

    if (newValue === "") {
      processedValue = "";
    } else if (field === "precio_unitario") {
      const raw = typeof newValue === "string" ? parseNumberInput(newValue) : newValue.toString();
      const numValue = parseFloat(raw);
      processedValue = isNaN(numValue) ? "" : numValue;
    } else {
      const numValue = typeof newValue === "string" ? parseInt(newValue) : newValue;
      processedValue = isNaN(numValue) ? "" : numValue;
    }

    const detalle = { ...detalles[index], [field]: processedValue };

    // Validar stock solo si aumenta cantidad y no se permite venta sin stock
    if (field === "cantidad" && (detalle.cantidad || 0) > (detalle.stock_disponible || 0) && !permitirVentaSinStock) {
      showAlert("Stock Insuficiente", "warning", {
        description: `Solo hay ${detalle.stock_disponible} unidades disponibles de este producto.`
      });
      return;
    }

    // Forzar recalculo de subtotal siempre
    const cantidad = Number(detalle.cantidad) || 0;
    const precio = Number(detalle.precio_unitario) || 0;
    detalle.subtotal = cantidad * precio;

    detalles[index] = detalle;

    onChange({
      ...value,
      detalles,
      total: calcularTotal(detalles),
    });
  };

  // ─── Validación ────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    if (!value.cliente_id || value.cliente_id === 0) {
      showAlert("Validación", "warning", { description: "Debes seleccionar un cliente" });
      return false;
    }

    if (value.detalles.length === 0) {
      showAlert("Validación", "warning", { description: "Debes agregar al menos un producto al carrito" });
      return false;
    }

    for (let i = 0; i < value.detalles.length; i++) {
      const d = value.detalles[i];
      if (Number(d.cantidad) <= 0) {
        showAlert("Validación", "warning", { description: `Producto #${i + 1}: La cantidad debe ser mayor a 0` });
        return false;
      }
      if (Number(d.precio_unitario) <= 0) {
        showAlert("Validación", "warning", { description: `Producto #${i + 1}: El precio debe ser mayor a 0` });
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
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
      {/* ── Columna Principal: Selección y Carrito ── */}
      <div className="flex-1 space-y-6">
        {/* Sección: Cliente */}
        <Card className="overflow-visible border-none shadow-sm ring-1 ring-primary-200">
          <Card.Content className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-100 text-accent-600 rounded-lg">
                  <IconUser size={20} />
                </div>
                <h3 className="text-lg font-bold text-primary-900">Selección de Cliente</h3>
              </div>

              {/* Selector de Tipo de Documento */}
              <div className="flex bg-primary-100 p-1 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => onChange({ ...value, tipo_documento: 'FACTURA' })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${value.tipo_documento === 'FACTURA'
                      ? 'bg-white text-accent-600 shadow-sm'
                      : 'text-primary-500 hover:text-primary-700'
                    }`}
                >
                  FACTURA
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...value, tipo_documento: 'RECIBO' })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${value.tipo_documento === 'RECIBO'
                      ? 'bg-white text-accent-600 shadow-sm'
                      : 'text-primary-500 hover:text-primary-700'
                    }`}
                >
                  RECIBO POS
                </button>
              </div>
            </div>

            {/* Preview del Próximo Correlativo */}
            {config && (
              <div className="mb-4 flex items-center gap-2 text-sm text-primary-500 bg-primary-50 p-2 rounded-lg border border-dashed border-primary-200 w-fit">
                <span className="font-medium">Próximo Correlativo:</span>
                <Badge variant="info" className="font-mono">
                  {value.tipo_documento === 'FACTURA'
                    ? config.numero_factura_preview
                    : config.numero_recibo_preview}
                </Badge>
              </div>
            )}

            <div className="relative">
              <div className="relative group">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-accent-500 transition-colors" size={18} />
                <input
                  type="text"
                  value={busquedaCliente}
                  onChange={(e) => {
                    setBusquedaCliente(e.target.value);
                    if (clienteSeleccionado) limpiarCliente();
                  }}
                  disabled={submitting}
                  placeholder="Buscar por nombre, documento o NIT..."
                  className="w-full pl-10 pr-4 py-3 bg-primary-50 border border-primary-200 rounded-xl
                           focus:bg-white focus:ring-4 focus:ring-accent-100 focus:border-accent-500
                           disabled:bg-primary-100 transition-all outline-none text-sm"
                />
              </div>

              {/* Badge del cliente seleccionado */}
              {clienteSeleccionado && (
                <div className="mt-4 p-4 bg-gradient-to-r from-accent-50 to-accent-50 border border-accent-100 rounded-xl flex items-center justify-between group animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-accent-600 font-bold border border-accent-100">
                      {clienteSeleccionado.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-accent-900 flex items-center gap-2">
                        {clienteSeleccionado.nombre}
                        <IconCheck size={14} className="text-accent-500" />
                      </p>
                      <div className="flex gap-3 mt-0.5">
                        {clienteSeleccionado.numero_documento && (
                          <span className="text-xs font-medium text-accent-600/70">
                            DOC: {clienteSeleccionado.numero_documento}
                          </span>
                        )}
                        {clienteSeleccionado.telefono && (
                          <span className="text-xs font-medium text-accent-600/70">
                            TEL: {clienteSeleccionado.telefono}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={limpiarCliente}
                    className="text-accent-600 hover:bg-accent-100 rounded-lg h-8 px-3 text-xs font-bold"
                  >
                    CAMBIAR
                  </Button>
                </div>
              )}

              {/* Dropdown clientes */}
              {mostrarDropdownCliente && (
                <div className="absolute z-30 w-full mt-2 bg-white border border-primary-100 rounded-xl shadow-2xl max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                  {buscandoCliente ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin h-6 w-6 border-2 border-accent-500 border-t-transparent rounded-full mx-auto" />
                      <p className="text-xs text-primary-500 mt-2 font-medium">Buscando clientes...</p>
                    </div>
                  ) : resultadosCliente.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="p-3 bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <IconUser size={24} className="text-primary-300" />
                      </div>
                      <p className="text-sm text-primary-500 font-medium">No encontramos resultados</p>
                      <p className="text-xs text-primary-400">Verifica el nombre o documento</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {resultadosCliente.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => seleccionarCliente(c)}
                          className="w-full text-left px-4 py-3 hover:bg-accent-50/50
                                   flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-100 group-hover:bg-accent-100 flex items-center justify-center text-primary-400 group-hover:text-accent-600 font-bold text-xs transition-colors">
                              {c.nombre.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-primary-900 group-hover:text-accent-700 transition-colors">
                                {c.nombre}
                              </p>
                              <p className="text-xs text-primary-500">
                                {c.numero_documento || "Sin documento"}
                              </p>
                            </div>
                          </div>
                          <IconChevronRight size={16} className="text-primary-300 group-hover:text-accent-400 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Sección: Productos */}
        <Card className="border-none shadow-sm ring-1 ring-primary-200">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-100 text-accent-600 rounded-lg">
                  <IconShoppingCart size={20} />
                </div>
                <h3 className="text-lg font-bold text-primary-900">Carrito de Venta</h3>
              </div>
              <Badge variant="info" className="px-3 py-1 font-bold">
                {value.detalles.length} {value.detalles.length === 1 ? 'PRODUCTO' : 'PRODUCTOS'}
              </Badge>
            </div>

            {/* Buscador de productos */}
            <div className="relative mb-6">
              <div className="relative group">
                <IconPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-accent-500 transition-colors" size={18} />
                <input
                  type="text"
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  disabled={submitting}
                  placeholder="Escanea código o busca por nombre..."
                  className="w-full pl-10 pr-4 py-3 bg-primary-50 border border-primary-200 rounded-xl
                           focus:bg-white focus:ring-4 focus:ring-accent-100 focus:border-accent-500
                           disabled:bg-primary-100 transition-all outline-none text-sm"
                />
              </div>

              {/* Dropdown productos */}
              {mostrarDropdownProducto && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-primary-100 rounded-xl shadow-2xl max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 ring-1 ring-black/5">
                  {buscandoProducto ? (
                    <div className="p-8 text-center text-primary-400">
                      <div className="animate-spin h-6 w-6 border-2 border-accent-500 border-t-transparent rounded-full mx-auto" />
                      <p className="text-xs mt-2 font-medium">Consultando inventario...</p>
                    </div>
                  ) : resultadosProducto.length === 0 ? (
                    <div className="p-8 text-center text-primary-400">
                      <IconPackage size={32} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-medium">No se encontró el producto</p>
                    </div>
                  ) : (
                    <div className="py-1">
                      {resultadosProducto.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => agregarProducto(p)}
                          disabled={p.stock_actual <= 0}
                          className="w-full text-left px-4 py-3 hover:bg-primary-50
                                   flex items-center justify-between group transition-colors
                                   disabled:opacity-40 disabled:grayscale"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-400 font-mono text-xs">
                              PROD
                            </div>
                            <div>
                              <p className="text-sm font-bold text-primary-900 group-hover:text-accent-700 transition-colors">
                                {p.nombre}
                              </p>
                              <div className="flex gap-2 items-center mt-0.5">
                                <span className="text-xs font-bold text-primary-400 uppercase">
                                  REF: {p.codigo}
                                </span>
                                <span className={`text-xs font-bold px-1.5 rounded ${p.stock_actual > 0 ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'}`}>
                                  STOCK: {p.stock_actual}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-accent-600">
                              {formatCurrency(p.precio_venta)}
                            </p>
                            <IconPlus size={14} className="ml-auto mt-1 text-accent-400 group-hover:text-accent-600 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Listado del Carrito */}
            <div className="space-y-3">
              {value.detalles.length > 0 ? (
                <>
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-black text-primary-400 uppercase tracking-widest border-b border-primary-50">
                    <div className="col-span-4">Producto</div>
                    <div className="col-span-3 text-center">Cantidad</div>
                    <div className="col-span-2 text-center">Precio Unit.</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                    <div className="col-span-1"></div>
                  </div>

                  <div className="space-y-2">
                    {value.detalles.map((detalle, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-primary-50/50 hover:bg-white
                                 p-4 rounded-xl border border-primary-100 transition-all hover:shadow-md hover:ring-1 hover:ring-accent-100 group"
                      >
                        {/* Producto */}
                        <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                          <div className="hidden sm:flex w-10 h-10 bg-white rounded-lg border border-primary-100 items-center justify-center text-primary-400">
                            <IconPackage size={20} />
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-bold text-primary-900 truncate">
                              {detalle.producto_nombre}
                            </p>
                            <p className="text-xs font-bold text-primary-400 overflow-hidden text-ellipsis">
                              REF: {detalle.producto_codigo} · <span className="text-accent-500">DISP: {detalle.stock_disponible}</span>
                            </p>
                          </div>
                        </div>

                        {/* Cantidad con botones +/- */}
                        <div className="col-span-1 md:col-span-3 flex justify-center">
                          <div className="flex items-center bg-white border border-primary-200 rounded-lg overflow-hidden shadow-sm">
                            <button
                              type="button"
                              onClick={() => updateDetalle(index, "cantidad", Math.max(1, (detalle.cantidad || 0) - 1))}
                              className="px-2 py-1.5 hover:bg-primary-50 text-primary-500 transition-colors border-r"
                            >
                              <IconMinus size={14} />
                            </button>
                            <input
                              type="number"
                              value={detalle.cantidad ?? ""}
                              onChange={(e) => updateDetalle(index, "cantidad", e.target.value)}
                              className={`w-12 text-center text-sm font-bold focus:outline-none ${numberClass}`}
                            />
                            <button
                              type="button"
                              onClick={() => updateDetalle(index, "cantidad", (detalle.cantidad || 0) + 1)}
                              className="px-2 py-1.5 hover:bg-primary-50 text-primary-500 transition-colors border-l"
                            >
                              <IconPlus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Precio editable con máscara */}
                        <div className="col-span-1 md:col-span-2 flex justify-center md:justify-start">
                          <div className="relative w-full max-w-36">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-400">{simbolo}</span>
                            <input
                              type="text"
                              value={formatNumberInput(detalle.precio_unitario?.toString() ?? "")}
                              onChange={(e) => updateDetalle(index, "precio_unitario", e.target.value)}
                              className={`w-full pl-5 pr-2 py-1.5 bg-white border border-primary-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-accent-100 focus:border-accent-400 outline-none transition-all ${numberClass}`}
                            />
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className={`col-span-1 md:col-span-2 text-right md:text-right font-black text-accent-600 text-sm py-1 md:py-0 ${numberClass}`}>
                          <span className="md:hidden text-xs text-primary-400 mr-2 uppercase">Subtotal:</span>
                          {formatCurrency(detalle.subtotal || 0)}
                        </div>

                        {/* Eliminar */}
                        <div className="col-span-1 flex justify-end">
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => removeDetalle(index)}
                            className="p-2 opacity-0 group-hover:opacity-100"
                          >
                            <IconTrash size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-primary-50/50 border-2 border-dashed border-primary-100 rounded-2xl animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <IconShoppingCart size={32} className="text-primary-200" />
                  </div>
                  <h4 className="text-primary-400 font-bold tracking-tight">CARRITO VACÍO</h4>
                  <p className="text-xs text-primary-400 mt-1 max-w-52 mx-auto">
                    Busca o escanea productos para comenzar la venta
                  </p>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* ── Columna Lateral: Resumen y Acciones ── */}
      <VentaFormResumen
        value={value}
        clienteSeleccionado={clienteSeleccionado}
        submitting={submitting}
        impuestoPorcentaje={impuestoPorcentaje}
        permitirVentaSinStock={permitirVentaSinStock}
        simbolo={simbolo}
        moneda={moneda}
        onCancel={onCancel}
      />
    </form>
  );
}
