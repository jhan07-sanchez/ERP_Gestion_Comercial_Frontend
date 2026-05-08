/**
 * 📝 COMPONENTE: ProductoForm
 *
 * Formulario reutilizable para crear y editar productos
 */

import { Card, Button, Input } from "@/shared/components/ui";
import type { Categoria } from "../../../modules/categorias/types";
import { useAlert } from "@/shared/components/alerts";


/**
 * Tipo de datos para el formulario
 * Usado SOLO en la UI, no es el payload del backend
 */
export interface ProductoFormData {
    nombre: string;
    codigo: string;
    descripcion?: string;
    categoria: number; // ID de categoría (siempre number en UI)
    precio_venta: number | "";
    precio_compra?: number | "";
    stock_minimo: number | "";
    estado?: boolean; // Solo visible en edición
    fecha_ingreso?: string; // YYYY-MM-DD
}

interface ProductoFormProps {
    // Datos del formulario
    value: ProductoFormData;

    // Catálogos
    categorias: Categoria[];
    loadingCategorias?: boolean;

    // Estados
    submitting?: boolean;
    error?: string | null;

    // Modo del formulario
    mode?: "create" | "edit";

    // Eventos
    onChange: (data: ProductoFormData) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export function ProductoForm({
    value,
    categorias,
    loadingCategorias = false,
    submitting = false,
    error,
    mode = "create",
    onChange,
    onSubmit,
    onCancel,
}: ProductoFormProps) {
    const { showAlert } = useAlert();
    /**
     * Maneja cambios en los inputs del formulario
     * Convierte tipos automáticamente según el campo
     */
    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, type, value: inputValue } = e.target;

      let newValue: unknown;

      if (type === "checkbox") {
        newValue = (e.target as HTMLInputElement).checked;
      } else if (type === "number") {
        // 🔥 CLAVE: permitir vacío
        newValue = inputValue === "" ? "" : Number(inputValue);
      } else {
        newValue = inputValue;
      }

      onChange({
        ...value,
        [name]: newValue as string | number | boolean | null,
      });
    };


    /**
     * Valida el formulario antes de enviar
     * Retorna true si es válido
     */
    const validateForm = (): boolean => {
        // Validaciones básicas
        if (!value.nombre?.trim()) {
            showAlert("Validación", "warning", { description: "El nombre del producto es obligatorio" });
            return false;
        }

        if (!value.categoria || value.categoria === 0) {
            showAlert("Validación", "warning", { description: "Debes seleccionar una categoría para el producto" });
            return false;
        }

        if (Number(value.precio_venta) <= 0) {
            showAlert("Validación", "warning", { description: "El precio de venta debe ser mayor a 0" });
            return false;
        }

        return true;
    };

    /**
     * Maneja el envío del formulario
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();



        // Validar antes de enviar
        if (!validateForm()) {
            return;
        }


        onSubmit();
    };

    return (
      <Card>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensajes de Error */}
            {error && (
              <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-danger-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-danger-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Sección: Información Básica */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">
                Información Básica
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Producto"
                  name="nombre"
                  value={value.nombre ?? ""}
                  onChange={handleChange}
                  placeholder="Ej: Laptop Dell Inspiron"
                  required
                  disabled={submitting}
                />

                {/* Campo Código: editable en creación, deshabilitado en edición */}
                <Input
                  label="Código"
                  name="codigo"
                  value={value.codigo || ""}
                  readOnly
                  disabled
                  helperText="Código generado automáticamente por el sistema"
                  placeholder="Se generará automáticamente"
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary-700 mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={value.descripcion ?? ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Descripción detallada del producto..."
                    disabled={submitting}
                    className="w-full px-4 py-2.5 border border-primary-300 rounded-lg
                           focus:ring-2 focus:ring-accent-200 focus:border-accent-500
                           disabled:bg-primary-50 disabled:cursor-not-allowed
                           transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Categoría */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">
                Categoría
              </h2>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1.5">
                  Categoría
                  <span className="text-danger-600 ml-1">*</span>
                </label>

                <select
                  name="categoria"
                  value={value.categoria || 0}
                  onChange={handleChange}
                  disabled={loadingCategorias || submitting}
                  required
                  className="block w-full px-4 py-2.5 border border-primary-300 rounded-lg
                         focus:ring-2 focus:ring-accent-200 focus:border-accent-500
                         disabled:bg-primary-100 disabled:cursor-not-allowed
                         transition-all"
                >
                  <option value={0}>
                    {loadingCategorias
                      ? "Cargando categorías..."
                      : "Seleccionar categoría..."}
                  </option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>

                {categorias.length === 0 && !loadingCategorias && (
                  <p className="mt-1.5 text-sm text-warning-600">
                    No hay categorías disponibles. Crea una categoría primero.
                  </p>
                )}
              </div>
            </div>

            {/* Sección: Precios */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">
                Precios
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Precio de Compra"
                  type="number"
                  name="precio_compra"
                  value={value.precio_compra ?? ""}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  disabled={submitting}
                  helperText="Opcional: Precio al que compras el producto"
                />

                <Input
                  label="Precio de Venta"
                  type="number"
                  name="precio_venta"
                  value={value.precio_venta ?? ""}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                  disabled={submitting}
                  helperText="Precio al que vendes el producto"
                />
              </div>

              {/* Cálculo de margen de ganancia */}
              {Number(value.precio_compra) > 0 &&
                Number(value.precio_venta) > Number(value.precio_compra) && (
                  <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg">
                    <p className="text-sm text-success-800">
                      <strong>Margen de ganancia:</strong> $
                      {(Number(value.precio_venta) - Number(value.precio_compra)).toFixed(2)} (
                      {(
                        ((Number(value.precio_venta) - Number(value.precio_compra)) /
                          Number(value.precio_compra)) *
                        100
                      ).toFixed(1)}
                      %)
                    </p>
                  </div>
                )}
            </div>

            {/* Sección: Inventario */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">
                Inventario
              </h2>

              <Input
                label="Stock Mínimo"
                type="number"
                name="stock_minimo"
                value={value.stock_minimo ?? ""}
                onChange={handleChange}
                min="0"
                placeholder="0"
                disabled={submitting}
                helperText="Cantidad mínima antes de generar alerta"
              />
            </div>

            {/* Fecha de Creación */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">
                Fecha de Creación
              </h2>
              <Input
                label="Fecha de Ingreso"
                type="date"
                name="fecha_ingreso"
                value={
                  value.fecha_ingreso ?? new Date().toISOString().split("T")[0]
                }
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            {/* Sección: Estado (solo en edición) */}
            {mode === "edit" && (
              <div className="pb-6">
                <h2 className="text-lg font-semibold text-primary-900 mb-4">
                  Estado del Producto
                </h2>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={value.estado ?? true}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-4 h-4 text-accent-600 border-primary-300 rounded
                           focus:ring-2 focus:ring-accent-500
                           disabled:cursor-not-allowed"
                  />
                  <span className="text-primary-700">
                    Producto activo y visible en el sistema
                  </span>
                </label>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={submitting}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={submitting || loadingCategorias}
                isLoading={submitting}
              >
                {submitting
                  ? "Guardando..."
                  : mode === "create"
                    ? "Crear Producto"
                    : "Actualizar Producto"}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    );
}
