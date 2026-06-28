import { useAlert } from "@shared/components/alerts";
import { useConfigStore } from "@shared/store/config.store";
import { Card } from "@shared/components/ui";
import { IconUser, IconCalendar, IconShoppingCart, IconPackage } from "@tabler/icons-react";
import type { ClienteParaFactura, FacturaFormState, ProductoParaFactura } from "../../types";
import { FacturaFormResumen } from "./FacturaFormResumen";
import { FacturaDetalleTable } from "./FacturaDetalleTable";
import { useFacturaFormState } from "../../hooks/useFacturaFormState";

import { useDebounceSearch } from "@shared/hooks";
import { clientesFacturacionAPI, productosFacturacionAPI } from "../../api/facturas-venta.api";
import { IconSearch, IconCheck, IconChevronRight, IconPlus } from "@tabler/icons-react";
import { Button } from "@shared/components/ui";
import { formatCurrency } from "@shared/utils/formatters";

interface FacturaFormProps {
  initialData?: Partial<FacturaFormState>;
  submitting?: boolean;
  error?: string | null;
  mode?: "create" | "edit";
  onSubmit: (data: FacturaFormState) => void;
  onCancel: () => void;
}

export function FacturaForm({
  initialData,
  submitting = false,
  onSubmit,
  onCancel,
}: FacturaFormProps) {
  const { showAlert } = useAlert();
  const { getImpuesto, getSimbolo, getMoneda, getPermitirVentaSinStock, getCondicionesPago } = useConfigStore();

  const simbolo = getSimbolo();
  const moneda = getMoneda();
  const impuestoPorcentaje = getImpuesto();
  const permitirVentaSinStock = getPermitirVentaSinStock();
  const condicionesPago = getCondicionesPago();

  const {
    formData,
    errors,
    agregarProducto,
    updateDetalle,
    removeDetalle,
    setCliente,
    updateCampo,
    validarFormulario
  } = useFacturaFormState({ initialData, porcentajeImpuesto: impuestoPorcentaje });

  // === Buscadores locales para UI (Separados de lógica core) ===
  const {
    results: resultadosCliente,
    isSearching: buscandoCliente,
    searchTerm: busquedaCliente,
    setSearchTerm: setBusquedaCliente,
    showDropdown: mostrarDropdownCliente,
    select: seleccionarCliente,
  } = useDebounceSearch<ClienteParaFactura>({
    searchFn: clientesFacturacionAPI.buscarClientes,
    debounceMs: 300,
  });

  const {
    results: resultadosProducto,
    isSearching: buscandoProducto,
    searchTerm: busquedaProducto,
    setSearchTerm: setBusquedaProducto,
    showDropdown: mostrarDropdownProducto,
    clear: clearBusquedaProducto,
  } = useDebounceSearch<ProductoParaFactura>({
    searchFn: productosFacturacionAPI.buscarProductos,
    debounceMs: 300,
  });

  const handleSeleccionarCliente = (cliente: ClienteParaFactura) => {
    setCliente(cliente);
    seleccionarCliente(cliente.nombre);
  };

  const handleAgregarProducto = (producto: ProductoParaFactura) => {
    if (producto.stock_actual <= 0 && !permitirVentaSinStock) {
      showAlert("Sin Stock", "warning", { description: "Este producto no tiene stock disponible." });
      return;
    }
    agregarProducto(producto);
    clearBusquedaProducto();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) {
      showAlert("Error de Validación", "warning", { description: "Por favor, revise los errores en el formulario." });
      return;
    }
    onSubmit(formData);
  };

  // Convertimos temporalmente formData a FacturaFormData para retrocompatibilidad con el Resumen si es necesario.
  // En React, no necesitamos cambiar FacturaFormResumen si sus props son compatibles.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formDataResumenCompatible: any = formData;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        {/* Errores Root */}
        {errors.root && (
          <div className="bg-danger-50 text-danger-600 p-4 rounded-xl border border-danger-200">
            <strong>Error:</strong> {errors.root}
          </div>
        )}

        {/* CARD CLIENTE */}
        <Card className="overflow-visible border-none shadow-sm ring-1 ring-primary-200">
          <Card.Content className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-100 text-accent-600 rounded-lg">
                  <IconUser size={20} />
                </div>
                <h3 className="text-lg font-bold text-primary-900">Selección de Cliente</h3>
              </div>
            </div>

            <div className="relative">
              <div className="relative group">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-accent-500 transition-colors" size={18} />
                <input
                  type="text"
                  value={busquedaCliente}
                  onChange={(e) => {
                    setBusquedaCliente(e.target.value);
                    if (formData.cliente_id) setCliente(null);
                  }}
                  disabled={submitting}
                  placeholder="Buscar por nombre, documento o NIT..."
                  className={`w-full pl-10 pr-4 py-3 bg-primary-50 border ${errors.cliente_id ? 'border-danger-400 ring-1 ring-danger-400' : 'border-primary-200'} rounded-xl focus:bg-white focus:ring-4 focus:ring-accent-100 focus:border-accent-500 disabled:bg-primary-100 transition-all outline-none text-sm`}
                />
              </div>
              {errors.cliente_id && <p className="text-danger-500 text-xs mt-1">{errors.cliente_id}</p>}

              {formData.cliente_id > 0 && !mostrarDropdownCliente && (
                 <div className="mt-4 p-4 bg-gradient-to-r from-accent-50 to-accent-50 border border-accent-100 rounded-xl flex items-center justify-between group animate-in fade-in slide-in-from-top-2">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-accent-600 font-bold border border-accent-100">
                       C
                     </div>
                     <div>
                       <p className="text-sm font-bold text-accent-900 flex items-center gap-2">
                         {busquedaCliente}
                         <IconCheck size={14} className="text-accent-500" />
                       </p>
                     </div>
                   </div>
                   <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     onClick={() => setCliente(null)}
                     className="text-accent-600 hover:bg-accent-100 rounded-lg h-8 px-3 text-xs font-bold"
                   >
                     CAMBIAR
                   </Button>
                 </div>
              )}

              {mostrarDropdownCliente && (
                <div className="absolute z-30 w-full mt-2 bg-white border border-primary-100 rounded-xl shadow-2xl max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                  {buscandoCliente ? (
                    <div className="p-8 text-center"><div className="animate-spin h-6 w-6 border-2 border-accent-500 border-t-transparent rounded-full mx-auto" /></div>
                  ) : resultadosCliente.length === 0 ? (
                    <div className="p-8 text-center text-primary-500 font-medium">No encontramos resultados</div>
                  ) : (
                    <div className="py-2">
                      {resultadosCliente.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSeleccionarCliente(c)}
                          className="w-full text-left px-4 py-3 hover:bg-accent-50/50 flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-100 group-hover:bg-accent-100 flex items-center justify-center text-primary-400 group-hover:text-accent-600 font-bold text-xs transition-colors">
                              {c.nombre.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-primary-900 group-hover:text-accent-700 transition-colors">{c.nombre}</p>
                              <p className="text-xs text-primary-500">{c.numero_documento || "Sin documento"}</p>
                            </div>
                          </div>
                          <IconChevronRight size={16} className="text-primary-300 group-hover:text-accent-400 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* CARD FECHAS */}
        <Card className="overflow-visible border-none shadow-sm ring-1 ring-primary-200">
          <Card.Content className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent-100 text-accent-600 rounded-lg"><IconCalendar size={20} /></div>
              <h3 className="text-lg font-bold text-primary-900">Fecha de Factura de Vencimiento</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condición de Pago</label>
                <select
                  value={formData.condicion_pago_id || ""}
                  onChange={(e) => updateCampo("condicion_pago_id", e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">Seleccione una condición...</option>
                  {condicionesPago.map(cp => (
                    <option key={cp.id} value={cp.id}>{cp.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Vencimiento</label>
                <input
                  type="date"
                  value={formData.fecha_vencimiento || ""}
                  onChange={(e) => updateCampo("fecha_vencimiento", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* CARD PRODUCTOS */}
        <Card className="border-none shadow-sm ring-1 ring-primary-200">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-100 text-accent-600 rounded-lg"><IconShoppingCart size={20} /></div>
                <h3 className="text-lg font-bold text-primary-900">Productos</h3>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 font-bold bg-blue-100 text-blue-800 rounded-full text-xs">
                  {formData.detalles.length} PRODUCTOS
                </span>
              </div>
            </div>

            <div className="relative mb-6">
              <div className="relative group">
                <IconPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-accent-500 transition-colors" size={18} />
                <input
                  type="text"
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  disabled={submitting}
                  placeholder="Escanea código o busca por nombre..."
                  className={`w-full pl-10 pr-4 py-3 bg-primary-50 border ${errors.detalles ? 'border-danger-400 ring-1 ring-danger-400' : 'border-primary-200'} rounded-xl focus:bg-white focus:ring-4 focus:ring-accent-100 focus:border-accent-500 disabled:bg-primary-100 transition-all outline-none text-sm`}
                />
              </div>
              {errors.detalles && <p className="text-danger-500 text-xs mt-1">{errors.detalles}</p>}

              {mostrarDropdownProducto && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-primary-100 rounded-xl shadow-2xl max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 ring-1 ring-black/5">
                  {buscandoProducto ? (
                     <div className="p-8 text-center text-primary-400">Cargando...</div>
                  ) : resultadosProducto.length === 0 ? (
                     <div className="p-8 text-center text-primary-400">No se encontró el producto</div>
                  ) : (
                    <div className="py-1">
                      {resultadosProducto.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleAgregarProducto(p)}
                          disabled={p.stock_actual <= 0 && !permitirVentaSinStock}
                          className="w-full text-left px-4 py-3 hover:bg-primary-50 flex items-center justify-between group transition-colors disabled:opacity-40 disabled:grayscale"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-400 font-mono text-xs">PROD</div>
                            <div>
                              <p className="text-sm font-bold text-primary-900 group-hover:text-accent-700 transition-colors">{p.nombre}</p>
                              <div className="flex gap-2 items-center mt-0.5">
                                <span className="text-xs font-bold text-primary-400 uppercase">REF: {p.codigo}</span>
                                <span className={`text-xs font-bold px-1.5 rounded ${p.stock_actual > 0 ? "bg-success-50 text-success-600" : "bg-danger-50 text-danger-600"}`}>
                                  STOCK: {p.stock_actual}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-accent-600">{formatCurrency(p.precio_venta)}</p>
                            <IconPlus size={14} className="ml-auto mt-1 text-accent-400 group-hover:text-accent-600 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <FacturaDetalleTable 
              detalles={formData.detalles}
              simbolo={simbolo}
              updateDetalle={updateDetalle}
              removeDetalle={removeDetalle}
            />
          </Card.Content>
        </Card>
      </div>

      <FacturaFormResumen
        value={formDataResumenCompatible}
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
