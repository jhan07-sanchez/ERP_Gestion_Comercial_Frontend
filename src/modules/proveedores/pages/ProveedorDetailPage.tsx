/**
 * 📄 PÁGINA: ProveedorDetailPage
 *
 * Página para ver los detalles de un proveedor.
 * Migrada a diseño responsivo Tailwind + PageContainer + PageHeader.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProveedorDetail } from "../hooks/useProveedorDetail";
import { useProveedorActions } from "../hooks/useProveedorActions";
import { ProveedorDetalleList } from "../components/ProveedorDetalleRow";
import type { ProveedorDetail } from "../types/proveedor.types";
import { useAlert } from "@/shared/components/alerts";
import { PageContainer, PageHeader, Button, Card, Badge } from "@/shared/components/ui";
import { 
    IconBuildingStore, 
    IconEdit, 
    IconTrash, 
    IconPower, 
    IconLoader2, 
    IconAlertCircle,
    IconHistory,
    IconChartBar
} from "@tabler/icons-react";

export default function ProveedorDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const proveedorId = id ? parseInt(id, 10) : undefined;

  const [proveedor, setProveedor] = useState<ProveedorDetail | null>(null);

  const { getProveedor, loading, error } = useProveedorDetail();

  const {
    deleteProveedor,
    updateProveedor,
    loading: actionLoading,
  } = useProveedorActions();
  const { showAlert, confirm } = useAlert();

  // 🔁 Cargar proveedor
  useEffect(() => {
    if (!proveedorId) return;

    getProveedor(proveedorId).then(setProveedor);
  }, [proveedorId, getProveedor]);

  const handleBack = () => navigate("/proveedores/lista");

  const handleEdit = () => {
    if (proveedorId) navigate(`/proveedores/${proveedorId}/editar`);

  };


  const handleDelete = async () => {
    if (!proveedorId || !proveedor) return;

    const confirmed = await confirm("Eliminar Proveedor", `¿Estás seguro de que deseas eliminar al proveedor "${proveedor.nombre}"? Esta acción no se puede deshacer.`, "critical");

    if (confirmed) {
      const success = await deleteProveedor(proveedorId);
      if (success) {
        showAlert("¡Eliminado!", "success", { description: "El proveedor ha sido eliminado correctamente." });
        navigate("/proveedores/lista");
      } else {
        showAlert("Error", "error", { description: "No se pudo eliminar el proveedor. Intenta de nuevo." });
      }
    }
  };

  const handleToggleEstado = async () => {
    if (!proveedorId || !proveedor) return;

    const actionText = proveedor.estado ? "desactivar" : "activar";
    const confirmed = await confirm(
      `${proveedor.estado ? "Desactivar" : "Activar"} Proveedor`,
      `¿Deseas ${actionText} al proveedor "${proveedor.nombre}"?`,
      proveedor.estado ? "warning" : "info"
    );

    if (confirmed) {
      const ok = await updateProveedor(proveedorId, {
        estado: !proveedor.estado,
      });

      if (ok) {
        showAlert("Estado Actualizado", "success", {
          description: `El proveedor "${proveedor.nombre}" ahora está ${!proveedor.estado ? "ACTIVO" : "INACTIVO"}.`
        });
        const actualizado = await getProveedor(proveedorId);
        setProveedor(actualizado);
      } else {
        showAlert("Error", "error", { description: "No se pudo actualizar el estado del proveedor." });
      }
    }
  };

  // ⏳ Loading
  if (loading || (!proveedor && !error)) {
    return (
      <PageContainer>
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <IconLoader2 className="animate-spin text-accent-600" size={48} stroke={1.5} />
            <p className="text-primary-600 font-black uppercase tracking-widest text-xs animate-pulse">Cargando información del proveedor...</p>
        </div>
      </PageContainer>
    );
  }

  // ❌ Error
  if (error || !proveedor) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full text-center space-y-6 bg-danger-50/50 p-10 rounded-3xl border border-danger-100 shadow-sm backdrop-blur-sm">
            <div className="w-20 h-20 bg-danger-100 text-danger-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-danger-200/50">
              <IconAlertCircle size={40} stroke={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-danger-900 uppercase tracking-tight">Proveedor no encontrado</h3>
              <p className="text-sm text-danger-700 font-medium leading-relaxed">{error || "No se pudo localizar este registro."}</p>
            </div>
            <Button 
                onClick={handleBack} 
                className="w-full h-12 bg-danger-600 hover:bg-danger-700 text-white border-none shadow-xl shadow-danger-200 font-black uppercase tracking-widest text-xs"
            >
              Volver al Directorio
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
        {actionLoading && (
            <div className="fixed inset-0 bg-primary-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
                    <IconLoader2 className="animate-spin text-accent-600" size={24} />
                    <span className="text-sm font-black text-primary-700 uppercase tracking-widest">Procesando...</span>
                </div>
            </div>
        )}

      <PageHeader
        title={proveedor.nombre}
        subtitle="Detalles completos y operaciones del proveedor"
        icon={<IconBuildingStore size={24} />}
        onBack={handleBack}
        actions={
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Badge variant={proveedor.estado ? "success" : "gray"} className="mb-2 sm:mb-0 sm:mr-4 self-start sm:self-auto py-1 px-3">
                    {proveedor.estado ? "Activo" : "Inactivo"}
                </Badge>
                <div className="flex bg-primary-100 p-1 rounded-xl shadow-inner border border-primary-200/60 w-full sm:w-auto">
                    <Button 
                        variant="ghost" 
                        onClick={handleEdit}
                        className="flex-1 sm:flex-none text-primary-600 hover:bg-white hover:text-accent-600 hover:shadow-sm"
                        leftIcon={<IconEdit size={16} />}
                        size="sm"
                    >
                        Editar
                    </Button>
                    <div className="w-px bg-primary-200 my-2 mx-1 hidden sm:block"></div>
                    <Button 
                        variant="ghost" 
                        onClick={handleToggleEstado}
                        className={`flex-1 sm:flex-none hover:bg-white hover:shadow-sm ${proveedor.estado ? 'text-warning-600 hover:text-warning-700' : 'text-success-600 hover:text-success-700'}`}
                        leftIcon={<IconPower size={16} />}
                        size="sm"
                    >
                        {proveedor.estado ? "Desactivar" : "Activar"}
                    </Button>
                    <div className="w-px bg-primary-200 my-2 mx-1 hidden sm:block"></div>
                    <Button 
                        variant="ghost" 
                        onClick={handleDelete}
                        className="flex-1 sm:flex-none text-danger-600 hover:bg-white hover:text-danger-700 hover:shadow-sm"
                        leftIcon={<IconTrash size={16} />}
                        size="sm"
                    >
                        Eliminar
                    </Button>
                </div>
            </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24 lg:pb-0">
        <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-primary-50/50 border-b border-primary-100 py-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                        <IconBuildingStore size={18} />
                    </div>
                    <h2 className="text-sm font-black text-primary-800 uppercase tracking-tight">Información Principal</h2>
                </Card.Header>
                <Card.Content className="p-0">
                    <ProveedorDetalleList proveedor={proveedor} />
                </Card.Content>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="border-primary-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-primary-50/50 border-b border-primary-100 py-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                        <IconChartBar size={18} />
                    </div>
                    <h2 className="text-sm font-black text-primary-800 uppercase tracking-tight">Estadísticas</h2>
                </Card.Header>
                <Card.Content className="p-6">
                    <div className="text-center py-6 px-4 bg-primary-50 border border-primary-100 border-dashed rounded-2xl">
                        <p className="text-xs font-bold text-primary-500 tracking-wide leading-relaxed">
                            Métricas se integrarán al habilitar el módulo de compras y cuentas por pagar.
                        </p>
                    </div>
                </Card.Content>
            </Card>

            <Card className="border-primary-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-primary-50/50 border-b border-primary-100 py-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                        <IconHistory size={18} />
                    </div>
                    <h2 className="text-sm font-black text-primary-800 uppercase tracking-tight">Historial</h2>
                </Card.Header>
                <Card.Content className="p-6">
                    <div className="flex items-center justify-between p-4 bg-primary-50 rounded-2xl border border-primary-100">
                        <span className="text-xs font-black uppercase tracking-widest text-primary-400">Fecha de Creación</span>
                        <span className="text-xs font-bold text-primary-700">
                            {new Date(proveedor.fecha_creacion ?? "").toLocaleString("es-ES")}
                        </span>
                    </div>
                </Card.Content>
            </Card>
        </div>
      </div>
    </PageContainer>
  );
}
