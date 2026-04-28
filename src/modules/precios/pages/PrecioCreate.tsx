import { useNavigate } from "react-router-dom";
import { Card, PageContainer, PageHeader } from "@/shared/components/ui";
import { useAlert } from "@/shared/components/alerts";
import { IconPlus } from "@tabler/icons-react";

import PrecioForm from "../components/PrecioForm";
import { useCreatePrecio } from "../hooks/usePrecios";
import type { PrecioCreateInput } from "../types/precio.types";

export default function PrecioCreate() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const createMutation = useCreatePrecio();

  /**
   *  Crear precio
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
      const payload: PrecioCreateInput = {
        producto: data.producto_id,
        proveedor: data.proveedor_id,
        precio: data.precio,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        vigente: data.vigente,
      };

      await createMutation.mutateAsync(payload);

      showAlert("✅ Éxito", "success", {
        description: "Precio registrado correctamente.",
      });

      setTimeout(() => {
        navigate("/precios/lista");
      }, 1500);
    } catch (err) {
      console.error("Error al crear precio:", err);
      throw err;
    }
  };

  /**
   * 🔙 Cancelar
   */
  const handleCancel = () => {
    navigate("/precios/lista");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Crear Nuevo Precio"
        subtitle="Asigna precios de compra por proveedor"
        icon={<IconPlus size={24} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24 lg:pb-0">
        {/* FORMULARIO */}
        <div className="lg:col-span-2">
          <Card className="border-primary-200 shadow-sm bg-white/50 backdrop-blur-sm">
            <Card.Content className="p-8">
              <PrecioForm
                isLoading={createMutation.isPending}
                error={createMutation.isError ? "Error al crear el precio" : null}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </Card.Content>
          </Card>
        </div>

        {/* PANEL DERECHO */}
        <div className="space-y-4">
          {/* CONSEJOS */}
          <Card className="border-accent-100 bg-accent-50/50 shadow-sm">
            <Card.Content className="p-4">
              <h3 className="font-black uppercase tracking-widest text-[10px] text-accent-900 mb-2">
                💡 Consejos
              </h3>
              <ul className="space-y-2 text-xs text-accent-800 font-medium">
                <li>✓ Relaciona correctamente producto y proveedor</li>
                <li>✓ Define precios realistas de compra</li>
                <li>✓ Usa fechas para control histórico</li>
                <li>✓ Mantén un solo precio vigente</li>
              </ul>
            </Card.Content>
          </Card>

          {/* INFO */}
          <Card className="border-primary-200 shadow-sm">
            <Card.Content className="p-4">
              <h3 className="font-black uppercase tracking-widest text-[10px] text-primary-700 mb-3">
                📊 Buenas prácticas
              </h3>
              <div className="space-y-2 text-xs text-primary-700">
                <p>• Evita duplicar precios activos</p>
                <p>• Controla cambios con historial</p>
                <p>• Integra con compras automáticamente</p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
