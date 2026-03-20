/**
 * 📝 COMPONENTE: ClienteForm
 * Formulario reutilizable para crear y editar clientes con diseño responsivo.
 */

import { Card, Button, Input } from "@/shared/components/ui";
import type { ClienteFormData, EstadoCliente } from "../types/cliente.types";
import { useAlert } from "@/shared/components/alerts";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";

interface ClienteFormProps {
  value: ClienteFormData;
  submitting?: boolean;
  error?: string | null;
  mode?: "create" | "edit";
  onChange: (data: ClienteFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ClienteForm({
  value,
  submitting = false,
  error,
  mode = "create",
  onChange,
  onSubmit,
  onCancel,
}: ClienteFormProps) {
  const { showAlert } = useAlert();

  const validateForm = (): boolean => {
    if (!value.nombre?.trim()) {
      showAlert("Validación", "warning", { description: "El nombre del cliente es obligatorio" });
      return false;
    }
    if (value.numero_documento && value.numero_documento.length < 5) {
      showAlert("Validación", "warning", { description: "El número de documento no parece válido (mínimo 5 caracteres)" });
      return false;
    }
    if (value.telefono && value.telefono.length < 7) {
      showAlert("Validación", "warning", { description: "El número de teléfono no parece válido (mínimo 7 dígitos)" });
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
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Nombre / Razón Social <span className="text-rose-500">*</span></label>
                        <Input
                            value={value.nombre || ""}
                            onChange={(e) => onChange({ ...value, nombre: e.target.value })}
                            disabled={submitting}
                            className="bg-slate-50/50 text-sm font-bold h-12"
                            placeholder="Ej. Juan Pérez o Empresa S.A.S"
                        />
                    </div>

                    <div className="space-y-1.5 focus-within:relative z-10">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Tipo de Documento</label>
                        <div className="relative">
                            <select
                                value={value.tipo_documento || "CEDULA"}
                                onChange={(e) => onChange({ ...value, tipo_documento: e.target.value })}
                                disabled={submitting}
                                className="w-full h-11 px-4 appearance-none font-bold text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                            >
                                <option value="CEDULA">Cédula de ciudadanía</option>
                                <option value="NIT">NIT</option>
                                <option value="CEDULA_EXTRANJERA">Cédula extranjera</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Número de Documento</label>
                        <Input
                            value={value.numero_documento || ""}
                            onChange={(e) => onChange({ ...value, numero_documento: e.target.value })}
                            disabled={submitting}
                            className="bg-slate-50/50 h-11"
                            placeholder="Ej. 123456789"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Teléfono</label>
                        <Input
                            value={value.telefono || ""}
                            onChange={(e) => onChange({ ...value, telefono: e.target.value })}
                            disabled={submitting}
                            className="bg-slate-50/50 h-11"
                            placeholder="Ej. +57 300 000 0000"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Correo Electrónico</label>
                        <Input
                            type="email"
                            value={value.email || ""}
                            onChange={(e) => onChange({ ...value, email: e.target.value })}
                            disabled={submitting}
                            className="bg-slate-50/50 h-11"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Dirección Física</label>
                        <textarea
                            value={value.direccion || ""}
                            onChange={(e) => onChange({ ...value, direccion: e.target.value })}
                            rows={3}
                            placeholder="Av. Principal #123, Ciudad..."
                            className="w-full h-24 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none"
                            disabled={submitting}
                        />
                    </div>

                    {mode === "edit" && (
                        <div className="space-y-1.5 md:col-span-2 pt-4 border-t border-slate-100">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Estado Operativo</label>
                            <div className="relative md:w-1/2">
                                <select
                                    value={value.estado ? "true" : "false"}
                                    onChange={(e) => onChange({ ...value, estado: e.target.value as EstadoCliente })}
                                    disabled={submitting}
                                    className="w-full h-11 px-4 appearance-none font-bold text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                                    >
                                    <option value="ACTIVO">Activo - Permite facturación</option>
                                    <option value="INACTIVO">Inactivo - Bloqueado</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card.Content>
        </Card>

        {/* Acciones Responsivas */}
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
              {mode === "create" ? "Guardar Cliente" : "Actualizar Cliente"}
            </Button>
        </div>
    </form>
  );
}
