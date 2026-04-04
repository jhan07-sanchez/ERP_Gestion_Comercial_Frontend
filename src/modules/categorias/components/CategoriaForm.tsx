/**
 * 📝 COMPONENTE: CategoriaForm
 * Formulario reutilizable para crear/editar categorías
 * Maneja validaciones, estados de carga y errores
 */

import { useState } from "react";
import { Button, Input } from "@/shared/components/ui";
import { IconLoader2, IconCheck, IconX } from "@tabler/icons-react";
import type { Categoria } from "../types";

interface CategoriaFormProps {
  categoria?: Categoria; // Si existe, es modo edición
  isLoading?: boolean;
  error?: string | null;
  onSubmit: (data: { nombre: string; descripcion?: string; estado?: boolean }) => Promise<void>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CategoriaForm({
  categoria,
  isLoading = false,
  error = null,
  onSubmit,
  onSuccess,
  onCancel,
}: CategoriaFormProps) {
  const isEditing = !!categoria;
  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    estado: boolean;
  }>({
    nombre: categoria?.nombre || "",
    descripcion: categoria?.descripcion || "",
    estado: categoria?.estado ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * ✅ Validar formulario
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (formData.nombre.trim().length > 50) {
      newErrors.nombre = "El nombre no puede exceder 50 caracteres";
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = "La descripción no puede exceder 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 📝 Manejar cambios en el formulario
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const fieldValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Limpiar error del campo cuando empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * 👁️ Marcar campo como visitado
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  };

  /**
   * 🚀 Manejar envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const payload = isEditing
        ? {
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim() || undefined,
            estado: formData.estado,
          }
        : {
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim() || undefined,
            estado: formData.estado,
          };

      await onSubmit(payload);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al procesar el formulario";
      setSubmitError(message);
      console.error("Error al enviar formulario:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Errores generales */}
      {(submitError || error) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <IconX size={18} className="text-red-600 flex-shrink-0" />
          <p className="text-sm font-medium text-red-600">{submitError || error}</p>
        </div>
      )}

      {/* Campo Nombre */}
      <div className="space-y-2">
        <label htmlFor="nombre" className="block text-sm font-black uppercase tracking-widest text-slate-700">
          Nombre de la Categoría <span className="text-red-600">*</span>
        </label>
        <Input
          id="nombre"
          name="nombre"
          type="text"
          placeholder="Ej: Electrónica, Ropa, Alimentos..."
          value={formData.nombre}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={50}
          className={`h-12 ${
            touched.nombre && errors.nombre
              ? "border-red-500 focus:border-red-500"
              : "border-slate-200 focus:border-blue-500"
          }`}
          disabled={isLoading}
        />
        {touched.nombre && errors.nombre && (
          <p className="text-xs font-bold text-red-600 flex items-center gap-1">
            <IconX size={14} />
            {errors.nombre}
          </p>
        )}
        <p className="text-xs text-slate-500 font-medium">
          {formData.nombre.length}/50 caracteres
        </p>
      </div>

      {/* Campo Descripción */}
      <div className="space-y-2">
        <label htmlFor="descripcion" className="block text-sm font-black uppercase tracking-widest text-slate-700">
          Descripción <span className="text-slate-400">(Opcional)</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          placeholder="Describe brevemente la categoría..."
          value={formData.descripcion}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={500}
          rows={4}
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${
            touched.descripcion && errors.descripcion
              ? "border-red-500 focus:border-red-500"
              : "border-slate-200 focus:border-blue-500"
          }`}
          disabled={isLoading}
        />
        {touched.descripcion && errors.descripcion && (
          <p className="text-xs font-bold text-red-600 flex items-center gap-1">
            <IconX size={14} />
            {errors.descripcion}
          </p>
        )}
        <p className="text-xs text-slate-500 font-medium">
          {formData.descripcion.length}/500 caracteres
        </p>
      </div>

      {/* Campo Estado */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <input
          id="estado"
          name="estado"
          checked={formData.estado}
          onChange={handleChange}
          disabled={isLoading}
          className="w-5 h-5"
        />
        <label
          htmlFor="estado"
          className="flex flex-col gap-1 cursor-pointer flex-1"
        >
          <span className="text-sm font-black uppercase tracking-widest text-slate-700">
            Categoría Activa
          </span>
          <span className="text-xs text-slate-600 font-medium">
            {formData.estado
              ? "✅ La categoría es visible en el catálogo"
              : "⏸️ La categoría está desactivada"}
          </span>
        </label>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 h-12"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading || Object.keys(errors).length > 0}
          className="flex-1 h-12 shadow-xl shadow-blue-200 font-black uppercase tracking-widest"
          leftIcon={isLoading ? <IconLoader2 className="animate-spin" size={18} /> : <IconCheck size={18} />}
        >
          {isLoading ? "Procesando..." : isEditing ? "Guardar Cambios" : "Crear Categoría"}
        </Button>
      </div>
    </form>
  );
}
