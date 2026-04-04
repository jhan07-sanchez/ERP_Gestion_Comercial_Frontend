/**
 * 📄 PÁGINA: CategoriasCreate
 * Crear nuevas categorías con formulario validado
 */

import { useNavigate } from "react-router-dom";
import { Card, PageContainer, PageHeader } from "@/shared/components/ui";
import { useAlert } from "@/shared/components/alerts";
import CategoriaForm from "../components/CategoriaForm";
import { useCategorias } from "../hooks/useCategorias";
import { IconPlus } from "@tabler/icons-react";
import type { CategoriaCreateInput } from "../types";

export default function CategoriasCreate() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { createCategoria, isLoading, error } = useCategorias();

  /**
   * 🚀 Manejar creación de categoría
   */
  const handleSubmit = async (data: { nombre: string; descripcion?: string; estado?: boolean }) => {
    try {
      await createCategoria(data as CategoriaCreateInput);
      showAlert(
        "✅ Éxito",
        "success",
        { description: "Categoría creada correctamente." },
      );
      // Redirigir al listado después de 1.5 segundos
      setTimeout(() => {
        navigate("/categorias");
      }, 1500);
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al crear categoría:", err);
    }
  };

  /**
   * 🔙 Volver al listado
   */
  const handleCancel = () => {
    navigate("/categorias");
  };

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Crear Nueva Categoría"
        subtitle="Agrega una nueva clasificación al catálogo de productos"
        icon={<IconPlus size={24} />}
      />

      {/* Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24 lg:pb-0">
        {/* Formulario - Lado izquierdo (principal) */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm bg-white/50 backdrop-blur-sm">
            <Card.Content className="p-8">
              <CategoriaForm
                isLoading={isLoading}
                error={error}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </Card.Content>
          </Card>
        </div>

        {/* Ayuda y sugerencias - Lado derecho */}
        <div className="space-y-4">
          {/* Información */}
          <Card className="border-blue-100 bg-blue-50/50 shadow-sm">
            <Card.Content className="p-4">
              <h3 className="font-black uppercase tracking-widest text-[10px] text-blue-900 mb-2">
                💡 Consejos
              </h3>
              <ul className="space-y-2 text-xs text-blue-800 font-medium">
                <li>✓ Usa nombres descriptivos y claros</li>
                <li>✓ La descripción ayuda a tu equipo</li>
                <li>✓ Puedes cambiar el estado más tarde</li>
                <li>✓ No hay límite de categorías</li>
              </ul>
            </Card.Content>
          </Card>

          {/* Ejemplos */}
          <Card className="border-slate-200 shadow-sm">
            <Card.Content className="p-4">
              <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-700 mb-3">
                📋 Ejemplos de categorías
              </h3>
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Electrónica</p>
                  <p className="text-slate-600">Dispositivos y accesorios</p>
                </div>
                <div className="border-t border-slate-100 pt-2 text-xs">
                  <p className="font-bold text-slate-900">Ropa</p>
                  <p className="text-slate-600">Prendas de vestir</p>
                </div>
                <div className="border-t border-slate-100 pt-2 text-xs">
                  <p className="font-bold text-slate-900">Alimentos</p>
                  <p className="text-slate-600">Productos comestibles</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
