import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Card, Button, Input } from "@/shared/components/ui";
import { useCajaActions } from "../hooks/useCajaActions";
import { useCaja } from "../hooks/Usecaja";
import { useCajaStore } from "../store/caja.store";
import { useAlert } from "@/shared/components/alerts";

interface FormData {
  caja_id: string;
  monto_inicial: string;
  observaciones: string;
}

export default function CajaAbrirPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { abrirCaja, loadingAbrir } = useCajaActions();
  const { cajas, fetchCajas } = useCaja();
  const setSesionActiva = useCajaStore((state) => state.setSesionActiva);

  const [isLoading, setIsLoading] = useState(false);

  // Cargamos las cajas disponibles (por si viene de /sesiones/nueva)
  useEffect(() => {
    if (!id) {
      fetchCajas();
    }
  }, [id, fetchCajas]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      caja_id: id || "",
      monto_inicial: "0",
      observaciones: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (!data.caja_id) {
        showAlert("Error", "warning", { description: "Debe seleccionar una caja" });
        return;
      }

      const cajaIdParsed = parseInt(data.caja_id, 10);
      if (isNaN(cajaIdParsed)) {
        showAlert("Error", "error", { description: "Caja inválida" });
        return;
      }

      setIsLoading(true);

      const sesion = await abrirCaja({
        caja_id: cajaIdParsed,
        monto_inicial: data.monto_inicial,
        observaciones: data.observaciones,
      });

      if (sesion) {
        showAlert("Éxito", "success", { description: "Caja abierta exitosamente" });
        setSesionActiva(sesion);
        navigate(`/caja/sesion/${sesion.id}`);
      }
    } catch {
      showAlert("Error", "error", { description: "Ocurrió un error al intentar abrir la caja" });
    } finally {
      setIsLoading(false);
    }
  };

  const cajasDisponibles = cajas.filter((c) => !c.esta_abierta);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Volver
        </Button>
        <h1 className="text-3xl font-bold">Abrir Sesión de Caja</h1>
      </div>

      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold">Detalles de Apertura</h2>
        </Card.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card.Content className="space-y-4">
            {!id && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Seleccionar Caja <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("caja_id", { required: "Este campo es requerido" })}
                  className="w-full rounded-md border border-gray-300 p-2 sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Seleccione una caja --</option>
                  {cajasDisponibles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                {errors.caja_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.caja_id.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Monto Inicial <span className="text-red-500">*</span>
              </label>
              <Controller
                name="monto_inicial"
                control={control}
                rules={{
                  required: "Este campo es requerido",
                  min: { value: 0, message: "El monto no puede ser negativo" }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    error={errors.monto_inicial?.message}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Observaciones (Opcional)
              </label>
              <textarea
                {...register("observaciones")}
                className="w-full rounded-md border border-gray-300 p-2 sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={3}
                placeholder="Indique si hay algún billete falso o detalle a tener en cuenta..."
              />
            </div>
          </Card.Content>

          <Card.Footer className="flex justify-end gap-3 p-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={loadingAbrir || isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loadingAbrir || isLoading}>
              {loadingAbrir || isLoading ? "Abriendo..." : "Abrir Caja"}
            </Button>
          </Card.Footer>
        </form>
      </Card>
    </div>
  );
}
