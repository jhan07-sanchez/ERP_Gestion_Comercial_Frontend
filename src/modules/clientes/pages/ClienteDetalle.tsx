/**
 * 📄 PÁGINA: ClienteDetalle
 * Detalle completo de un cliente con diseño responsivo
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Badge, PageContainer, PageHeader } from "@/shared/components/ui";
import { useClientes } from "../hooks/useClientes";
import type { ClienteDetail, EstadoCliente } from "../types";
import { getTipoDocumentoLabel } from "../types";
import { useAlert } from "@/shared/components/alerts";
import { 
    IconFilter, 
    IconEdit, 
    IconPower, 
    IconLoader2, 
    IconAlertCircle,
    IconHistory,
    IconChartBar,
    IconUser
} from "@tabler/icons-react";

const estadoVariantMap: Record<EstadoCliente, "success" | "warning" | "danger"> = {
  ACTIVO: "success",
  INACTIVO: "warning",
  BLOQUEADO: "danger",
};

export default function ClienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    getCliente,
    activarCliente,
    desactivarCliente,
    loadingActivar,
    loadingDesactivar,
  } = useClientes();
  const { showAlert, confirm } = useAlert();

  const [cliente, setCliente] = useState<ClienteDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadCliente = async () => {
      try {
        const data = await getCliente(Number(id));
        setCliente(data);
      } catch (err) {
        console.error(err);
        navigate("/clientes");
      } finally {
        setLoading(false);
      }
    };

    loadCliente();
  }, [id, getCliente, navigate]);

  const handleActivar = async () => {
    if (!cliente) return;
    const confirmed = await confirm("Activar Cliente", `¿Deseas activar al cliente "${cliente.nombre}"?`, "info");
    if (!confirmed) return;

    const result = await activarCliente(cliente.id);
    if (result) {
      showAlert("Cliente Activado", "success", { description: `El cliente "${cliente.nombre}" ha sido activado.` });
      setCliente((prev) => (prev ? { ...prev, estado: "ACTIVO" } : prev));
    }
  };

  const handleDesactivar = async () => {
    if (!cliente) return;
    const confirmed = await confirm("Desactivar Cliente", `¿Deseas desactivar al cliente "${cliente.nombre}"? No podrá realizar nuevas ventas mientras esté inactivo.`, "warning");
    if (!confirmed) return;

    const result = await desactivarCliente(cliente.id);
    if (result) {
      showAlert("Cliente Desactivado", "warning", { description: `El cliente "${cliente.nombre}" ha sido desactivado.` });
      setCliente((prev) => (prev ? { ...prev, estado: "INACTIVO" } : prev));
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <IconLoader2 className="animate-spin text-blue-600" size={48} stroke={1.5} />
            <p className="text-slate-600 font-black uppercase tracking-widest text-[10px] animate-pulse">Cargando información del cliente...</p>
        </div>
      </PageContainer>
    );
  }

  if (!cliente) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full text-center space-y-6 bg-rose-50/50 p-10 rounded-3xl border border-rose-100 shadow-sm backdrop-blur-sm">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-200/50">
              <IconAlertCircle size={40} stroke={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-rose-900 uppercase tracking-tight">Cliente no encontrado</h3>
              <p className="text-sm text-rose-700 font-medium leading-relaxed">No se pudo localizar este registro.</p>
            </div>
            <Button 
                onClick={() => navigate("/clientes")} 
                className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white border-none shadow-xl shadow-rose-200 font-black uppercase tracking-widest text-[10px]"
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
      <PageHeader
        title={cliente.nombre}
        subtitle="Detalles completos y operaciones del cliente"
        icon={<IconFilter size={24} />}
        onBack={() => navigate("/clientes")}
        actions={
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Badge variant={estadoVariantMap[cliente.estado]} className="mb-2 sm:mb-0 sm:mr-4 self-start sm:self-auto py-1 px-3 uppercase tracking-widest font-black text-[10px]">
                    {cliente.estado}
                </Badge>
                <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200/60 w-full sm:w-auto">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                        className="flex-1 sm:flex-none text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                        leftIcon={<IconEdit size={16} />}
                        size="sm"
                    >
                        Editar
                    </Button>
                    <div className="w-px bg-slate-200 my-2 mx-1 hidden sm:block"></div>
                    
                    {cliente.estado === "INACTIVO" && (
                        <Button
                            variant="ghost"
                            onClick={handleActivar}
                            isLoading={loadingActivar}
                            className="flex-1 sm:flex-none text-emerald-600 hover:bg-white hover:text-emerald-700 hover:shadow-sm"
                            leftIcon={<IconPower size={16} />}
                            size="sm"
                        >
                            Activar
                        </Button>
                    )}

                    {cliente.estado === "ACTIVO" && (
                        <Button
                            variant="ghost"
                            onClick={handleDesactivar}
                            isLoading={loadingDesactivar}
                            className="flex-1 sm:flex-none text-amber-600 hover:bg-white hover:text-amber-700 hover:shadow-sm"
                            leftIcon={<IconPower size={16} />}
                            size="sm"
                        >
                            Desactivar
                        </Button>
                    )}
                </div>
            </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24 lg:pb-0">
        <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <IconUser size={18} />
                    </div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Información Principal</h2>
                </Card.Header>
                <Card.Content className="p-0">
                    <div className="flex flex-col bg-white">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 transition-colors hover:bg-slate-50/50 border-b border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-0 w-full sm:w-1/3">Nombre Comercial</div>
                            <div className="w-full sm:w-2/3 sm:text-right text-sm text-slate-700 font-medium">{cliente.nombre}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 transition-colors hover:bg-slate-50/50 border-b border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-0 w-full sm:w-1/3">Documento</div>
                            <div className="w-full sm:w-2/3 sm:text-right text-sm text-slate-700 font-medium">{getTipoDocumentoLabel(cliente.tipo_documento)} {cliente.numero_documento}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 transition-colors hover:bg-slate-50/50 border-b border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-0 w-full sm:w-1/3">Teléfono de Contacto</div>
                            <div className="w-full sm:w-2/3 sm:text-right text-sm text-slate-700 font-medium">
                                {cliente.telefono ? (
                                    <a href={`tel:${cliente.telefono}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">{cliente.telefono}</a>
                                ) : <span className="text-slate-400 italic">—</span>}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 transition-colors hover:bg-slate-50/50 border-b border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-0 w-full sm:w-1/3">Correo Electrónico</div>
                            <div className="w-full sm:w-2/3 sm:text-right text-sm text-slate-700 font-medium">
                                {cliente.email ? (
                                    <a href={`mailto:${cliente.email}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">{cliente.email}</a>
                                ) : <span className="text-slate-400 italic">—</span>}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 transition-colors hover:bg-slate-50/50">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-0 w-full sm:w-1/3">Dirección Física</div>
                            <div className="w-full sm:w-2/3 sm:text-right text-sm text-slate-700 font-medium">{cliente.direccion || <span className="text-slate-400 italic">—</span>}</div>
                        </div>
                    </div>
                </Card.Content>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <IconChartBar size={18} />
                    </div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Estadísticas</h2>
                </Card.Header>
                <Card.Content className="p-6">
                    <div className="text-center py-6 px-4 bg-slate-50 border border-slate-100 border-dashed rounded-2xl">
                        <p className="text-xs font-bold text-slate-500 tracking-wide leading-relaxed">
                            Aún no hay compras registradas para este cliente.
                        </p>
                    </div>
                </Card.Content>
            </Card>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                        <IconHistory size={18} />
                    </div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Historial</h2>
                </Card.Header>
                <Card.Content className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha Creado</span>
                        <span className="text-xs font-bold text-slate-700">
                            {cliente.fecha_creacion ? new Date(cliente.fecha_creacion).toLocaleDateString("es-CO") : "Sin fecha"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Última Acc.</span>
                        <span className="text-xs font-bold text-slate-700">
                            {cliente.fecha_actualizacion ? new Date(cliente.fecha_actualizacion).toLocaleDateString("es-CO") : "Sin fecha"}
                        </span>
                    </div>
                </Card.Content>
            </Card>
        </div>
      </div>
    </PageContainer>
  );
}
