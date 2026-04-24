import { useNavigate, useParams } from "react-router-dom";
import { Card, PageContainer, PageHeader } from "@/shared/components/ui";
import { useAlert } from "@/shared/components/alerts";
import { IconEdit } from "@tabler/icons-react";

import PrecioForm from "../components/PrecioForm";
import { usePrecioDetail, useUpdatePrecio } from "../hooks/usePrecios";
import type { PrecioUpdateInput } from "../types/precio.types";

export default function PrecioEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showAlert } = useAlert();

  const { data: precioActual, isLoading, isError } = usePrecioDetail(Number(id));
  const updateMutation = useUpdatePrecio();

  /**
   * Actualizar precio
   */
  const handleSubmit = async (data: {
    producto_id: number;
    proveedor_id: number;
    precio: number;
    fecha_inicio: string;
    fecha_fin: string;
    vigente: boolean;
  }) => {
    try {
      const payload: PrecioUpdateInput = {
        precio: data.precio,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin || undefined,
      };

      await updateMutation.mutateAsync({ id: Number(id), data: payload });

      showAlert("✅ Éxito", "success", {
        description: "Precio actualizado correctamente.",
      });

      setTimeout(() => {
        navigate("/precios/lista");
      }, 1500);
    } catch (err) {
      console.error("Error al actualizar precio:", err);
      throw err;
    }
  };

  /**
   * 🔙 Cancelar
   */
  const handleCancel = () => {
    navigate("/precios/lista");
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Editar Precio" subtitle="Cargando datos..." />
      </PageContainer>
    );
  }

  if (isError || !precioActual) {
    return (
      <PageContainer>
        <PageHeader title="Error" subtitle="No se pudo cargar el precio" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Editar Precio"
        subtitle="Actualiza el precio o su vigencia"
        icon={<IconEdit size={24} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24 lg:pb-0">
        {/* FORMULARIO */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm bg-white/50 backdrop-blur-sm">
            <Card.Content className="p-8">
              <PrecioForm
                precio={precioActual}
                isLoading={updateMutation.isPending}
                error={updateMutation.isError ? "Error al actualizar el precio" : null}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </Card.Content>
          </Card>
        </div>

        {/* PANEL DERECHO */}
        <div className="space-y-4">
          <Card className="border-amber-100 bg-amber-50/50 shadow-sm">
            <Card.Content className="p-4">
              <h3 className="font-black uppercase tracking-widest text-[10px] text-amber-900 mb-2">
                ⚠️ Importante
              </h3>
              <ul className="space-y-2 text-xs text-amber-800 font-medium">
                <li>• No se puede cambiar producto o proveedor de un precio existente.</li>
                <li>• Si el precio cambia drásticamente, considera crear uno nuevo.</li>
                <li>• Asegúrate de colocar una fecha de inicio correcta.</li>
              </ul>
            </Card.Content>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
