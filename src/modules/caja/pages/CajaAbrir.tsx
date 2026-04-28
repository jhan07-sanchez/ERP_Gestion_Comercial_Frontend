import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Card, Button, Input, PageContainer, PageHeader } from "@/shared/components/ui";
import { useCajaActions } from "../hooks/useCajaActions";
import { useCaja } from "../hooks/Usecaja";
import { useCajaStore } from "../store/caja.store";
import { useAlert } from "@/shared/components/alerts";
import { IconDoor, IconArrowLeft } from "@tabler/icons-react";

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
    <PageContainer maxWidth="md">
      <PageHeader
        title="Abrir Sesión de Caja"
        subtitle="Inicia una nueva jornada de movimientos"
        icon={<IconDoor size={24} />}
        backButton={
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2 h-10 w-10 flex items-center justify-center rounded-xl"
          >
            <IconArrowLeft size={20} />
          </Button>
        }
      />

      <Card className="shadow-lg border-primary-100">
        <Card.Header>
          <Card.Title>Detalles de Apertura</Card.Title>
        </Card.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card.Content className="space-y-6">
            {!id && (
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary-700">
                  Seleccionar Caja <span className="text-danger-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("caja_id", { required: "Este campo es requerido" })}
                    className={`
                      block w-full px-4 py-2.5 
                      border rounded-button text-sm bg-white
                      focus:ring-2 focus:ring-accent-100 focus:border-accent-500 transition-all
                      ${errors.caja_id ? 'border-danger-300' : 'border-primary-300'}
                    `}
                  >
                    <option value="">-- Seleccione una caja --</option>
                    {cajasDisponibles.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.caja_id && (
                  <p className="text-xs text-danger-600 font-medium">{errors.caja_id.message}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary-700">
                  Monto Inicial <span className="text-danger-500">*</span>
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
                      className="bg-primary-50/30"
                    />
                  )}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary-700">
                  Observaciones (Opcional)
                </label>
                <textarea
                  {...register("observaciones")}
                  rows={4}
                  placeholder="Indique si hay algún billete falso o detalle a tener en cuenta..."
                  className="
                    block w-full px-4 py-2.5 
                    border border-primary-300 rounded-button 
                    text-sm bg-white focus:ring-2 focus:ring-accent-100 focus:border-accent-500 transition-all
                  "
                />
              </div>
            </div>
          </Card.Content>

          <Card.Footer className="flex flex-col sm:flex-row justify-end gap-3 p-6 bg-primary-50/50">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto order-2 sm:order-1"
              onClick={() => navigate(-1)}
              disabled={loadingAbrir || isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto order-1 sm:order-2 shadow-lg shadow-accent-200"
              disabled={loadingAbrir || isLoading}
            >
              {loadingAbrir || isLoading ? "Abriendo..." : "Abrir Caja"}
            </Button>
          </Card.Footer>
        </form>
      </Card>
    </PageContainer>
  );
}

