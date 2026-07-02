import { useEffect, useState } from 'react';
import { Button, Card, Input } from '@/shared/components/ui';
import type { CondicionPagoInput } from '@/modules/configuracion/types/configuracion.types';

interface CondicionPagoFormProps {
  isSaving?: boolean;
  error?: string | null;
  title?: string;
  submitLabel?: string;
  initialValues?: Pick<CondicionPagoInput, 'nombre' | 'dias_plazo' | 'activo'>;
  onCancel: () => void;
  onSubmit: (data: Pick<CondicionPagoInput, 'nombre' | 'dias_plazo' | 'activo'>) => Promise<void>;
}

interface FormState {
  nombre: string;
  dias_plazo: number;
  activo: boolean;
}

export function CondicionPagoForm({
  isSaving = false,
  error = null,
  title = 'Nueva condición de pago',
  submitLabel = 'Guardar condición',
  initialValues,
  onCancel,
  onSubmit,
}: CondicionPagoFormProps) {
  const [formState, setFormState] = useState<FormState>({
    nombre: '',
    dias_plazo: 0,
    activo: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setFormState({
        nombre: initialValues.nombre,
        dias_plazo: initialValues.dias_plazo,
        activo: initialValues.activo ?? true,
      });
      setErrors({});
      setSubmitError(null);
      return;
    }

    setFormState({
      nombre: '',
      dias_plazo: 0,
      activo: true,
    });
    setErrors({});
    setSubmitError(null);
  }, [initialValues]);

  const validate = (): boolean => {
    const validationErrors: Record<string, string> = {};

    if (!formState.nombre.trim()) {
      validationErrors.nombre = 'El nombre es requerido';
    } else if (formState.nombre.trim().length < 2) {
      validationErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (formState.dias_plazo < 0) {
      validationErrors.dias_plazo = 'Los días de plazo no pueden ser negativos';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (field: keyof FormState, value: string | number | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        nombre: formState.nombre.trim(),
        dias_plazo: formState.dias_plazo,
        activo: formState.activo,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al guardar la condición de pago');
    }
  };

  return (
    <Card className="mb-6 shadow-sm border-primary-100 overflow-hidden">
      <Card.Header className="bg-primary-50 border-b border-primary-100 py-4 px-6">
        <h2 className="text-sm font-black uppercase tracking-tight text-primary-700">
          {title}
        </h2>
      </Card.Header>

      <form onSubmit={handleSubmit}>
        <Card.Content className="p-6 space-y-6">
          {(submitError || error) && (
            <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-danger-700">
              {submitError || error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="condicion-nombre" className="block text-sm font-semibold text-primary-700">
                Nombre
              </label>
              <Input
                id="condicion-nombre"
                name="nombre"
                placeholder="Ej: Crédito 15 días"
                value={formState.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                disabled={isSaving}
                className={errors.nombre ? 'border-danger-500 focus:border-danger-500' : ''}
              />
              {errors.nombre && <p className="text-xs text-danger-600">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="condicion-dias" className="block text-sm font-semibold text-primary-700">
                Días de plazo
              </label>
              <Input
                id="condicion-dias"
                name="dias_plazo"
                type="number"
                min={0}
                placeholder="0"
                value={formState.dias_plazo}
                onChange={(e) => handleChange('dias_plazo', Number(e.target.value))}
                disabled={isSaving}
                className={errors.dias_plazo ? 'border-danger-500 focus:border-danger-500' : ''}
              />
              {errors.dias_plazo && <p className="text-xs text-danger-600">{errors.dias_plazo}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" variant="success" isLoading={isSaving}>
              {submitLabel}
            </Button>
          </div>
        </Card.Content>
      </form>
    </Card>
  );
}
