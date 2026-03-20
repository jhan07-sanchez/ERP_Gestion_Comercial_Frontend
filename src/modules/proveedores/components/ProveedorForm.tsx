/**
 * 📝 COMPONENTE: ProveedorForm
 *
 * Formulario reutilizable para crear y editar proveedores con diseño responsivo.
 */

import { Card, Button, Input } from "@/shared/components/ui";
import type { ProveedorFormData } from "../types/proveedor.types";
import { useAlert } from "@/shared/components/alerts";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";

interface ProveedorFormProps {
  value: ProveedorFormData;
  submitting?: boolean;
  error?: string | null;
  onChange: (data: ProveedorFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ProveedorForm({
  value,
  submitting = false,
  error,
  onChange,
  onSubmit,
  onCancel,
}: ProveedorFormProps) {
  const { showAlert } = useAlert();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value: inputValue, type } = e.target as HTMLInputElement;
    let processedValue: string | boolean = inputValue;

    if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    onChange({
      ...value,
      [name]: processedValue,
    });
  };

  const validateForm = (): boolean => {
    if (!value.nombre?.trim()) {
      showAlert("Validación", "warning", { description: "El nombre del proveedor es obligatorio" });
      return false;
    }

    if (value.email && !value.email.includes("@")) {
      showAlert("Validación", "warning", { description: "El email ingresado no es válido" });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-slate-200 shadow-sm overflow-hidden">
        <Card.Content className="p-4 sm:p-8 space-y-6">
            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                    <IconX size={20} className="text-rose-600 shrink-0" />
                    <p className="text-[11px] text-rose-800 font-bold uppercase tracking-tight leading-relaxed">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Nombre Comercial <span className="text-rose-500">*</span></label>
                    <Input
                        name="nombre"
                        value={value.nombre || ''}
                        onChange={handleChange}
                        disabled={submitting}
                        className="bg-slate-50/50 text-sm font-bold h-12"
                        placeholder="Ej. Distribuidora Central S.A."
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Documento (NIT/RUT)</label>
                    <Input
                        name="documento"
                        value={value.documento || ""}
                        onChange={handleChange}
                        disabled={submitting}
                        className="bg-slate-50/50 h-11"
                        placeholder="Ej. 900.123.456-7"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Teléfono</label>
                    <Input
                        name="telefono"
                        value={value.telefono || ""}
                        onChange={handleChange}
                        disabled={submitting}
                        className="bg-slate-50/50 h-11"
                        placeholder="Ej. +57 300 000 0000"
                    />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Correo Electrónico</label>
                    <Input
                        name="email"
                        type="email"
                        value={value.email || ""}
                        onChange={handleChange}
                        disabled={submitting}
                        className="bg-slate-50/50 h-11"
                        placeholder="ejemplo@proveedor.com"
                    />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Dirección Física</label>
                    <textarea
                        name="direccion"
                        value={value.direccion || ""}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Av. Principal #123, Ciudad..."
                        className="w-full h-24 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none"
                        disabled={submitting}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Fecha de Ingreso</label>
                    <Input
                      type="date"
                      name="fecha_ingreso"
                      value={value.fecha_creacion ? value.fecha_creacion.split("T")[0] : ""}
                      onChange={handleChange}
                      disabled={submitting}
                      className="bg-slate-50/50 h-11"
                    />
                </div>

                <div className="flex items-end h-full pt-6 md:pt-0">
                    <label className="flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors group w-full">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${value.estado ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                            {value.estado && <IconCheck size={14} className="text-white" />}
                        </div>
                        <input
                            type="checkbox"
                            name="estado"
                            checked={value.estado}
                            onChange={handleChange}
                            className="hidden"
                            disabled={submitting}
                        />
                        <span className="text-xs font-black text-slate-600 uppercase tracking-tight">Proveedor Activo</span>
                    </label>
                </div>
            </div>
        </Card.Content>
        </Card>

        {/* Mobile Sticky / Desktop Row Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-[40] lg:relative lg:bg-transparent lg:border-none lg:p-0 lg:z-0 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={submitting}
              className="w-full sm:w-auto h-12 px-8"
            >
              Cancelar
            </Button>

            <Button 
                type="submit" 
                isLoading={submitting}
                className="w-full sm:w-auto h-12 px-8 shadow-xl shadow-blue-200 lg:shadow-none"
                leftIcon={<IconDeviceFloppy size={20} />}
            >
              Guardar Proveedor
            </Button>
        </div>
    </form>
  );
}
