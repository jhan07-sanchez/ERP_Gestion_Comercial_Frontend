// proveedores/components/ProveedorForm.tsx

import React, { useState, useEffect } from "react";
import type { Proveedor, ProveedorFormData } from "../types/proveedor.types";

interface ProveedorFormProps {
  proveedor?: Proveedor | null;
  onSubmit: (data: ProveedorFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export const ProveedorForm: React.FC<ProveedorFormProps> = ({
  proveedor,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<ProveedorFormData>({
    nombre: "",
    documento: "",
    telefono: "",
    email: "",
    direccion: "",
    activo: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Cargar datos del proveedor si existe (modo edición)
  useEffect(() => {
    if (!proveedor) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({
      ...prev,
      nombre: proveedor.nombre,
      documento: proveedor.documento,
      telefono: proveedor.telefono,
      email: proveedor.email,
      direccion: proveedor.direccion,
      activo: proveedor.activo,
    }));
  }, [proveedor]);


  // Manejar cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.documento.trim()) {
      newErrors.documento = "El documento es requerido";
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar formato de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="proveedor-form">
      <div className="form-container">
        {/* Mensaje de error general */}
        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="nombre">
            Nombre <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? "input-error" : ""}
            disabled={loading}
            placeholder="Ej: Distribuidora ABC"
          />
          {errors.nombre && (
            <span className="error-message">{errors.nombre}</span>
          )}
        </div>

        {/* Documento */}
        <div className="form-group">
          <label htmlFor="documento">
            Documento (RUT/NIT/DNI) <span className="required">*</span>
          </label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            className={errors.documento ? "input-error" : ""}
            disabled={loading}
            placeholder="Ej: 12345678-9"
          />
          {errors.documento && (
            <span className="error-message">{errors.documento}</span>
          )}
        </div>

        {/* Teléfono */}
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            disabled={loading}
            placeholder="Ej: +56 9 1234 5678"
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
            disabled={loading}
            placeholder="Ej: contacto@proveedor.com"
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* Dirección */}
        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <textarea
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={loading}
            rows={3}
            placeholder="Ej: Av. Principal 123, Santiago"
          />
        </div>

        {/* Estado Activo */}
        <div className="form-group checkbox-group">
          <label htmlFor="activo">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              disabled={loading}
            />
            <span>Proveedor activo</span>
          </label>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : proveedor ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </form>
  );
};
