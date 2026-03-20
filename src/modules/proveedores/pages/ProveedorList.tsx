/**
 * Listado de proveedores.
 * Muestra tabla con todos los proveedores y acciones CRUD con diseño responsivo.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Table, Badge, PageContainer, PageHeader } from "@/shared/components/ui";
import { useProveedor } from "../hooks/useProveedor";
import type { ProveedorFilters } from "../types/proveedor.types";
import { useAlert } from "@/shared/components/alerts";
import { 
    IconPlus, 
    IconSearch, 
    IconEdit, 
    IconTrash, 
    IconTruckDelivery, 
    IconMail, 
    IconPhone, 
    IconAlertCircle,
    IconLoader2
} from "@tabler/icons-react";

export default function ProveedorList() {
  const navigate = useNavigate();

  const {
    proveedores,
    isLoading,
    error,
    fetchProveedores,
    deleteProveedor,
    applyFilters,
  } = useProveedor();
  const { showAlert, confirm } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");

  // Cargar proveedores al montar
  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  // Búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filters: ProveedorFilters = value ? { search: value } : {};
    applyFilters(filters);
  };

  // Eliminación
  const handleDelete = async (id: number) => {
    const confirmar = await confirm(
      "Eliminar Proveedor",
      "¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.",
      "critical"
    );

    if (confirmar) {
      try {
        await deleteProveedor(id);
        showAlert("Proveedor Eliminado", "success");
      } catch (err) {
        console.error("Error al eliminar proveedor:", err);
        showAlert("Error", "error", { description: "No se pudo eliminar el proveedor." });
      }
    }
  };

  // Loading inicial
  if (isLoading && proveedores.length === 0) {
    return (
      <PageContainer>
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <IconLoader2 className="animate-spin text-blue-600" size={48} stroke={1.5} />
            <p className="text-slate-600 font-black uppercase tracking-widest text-[10px] animate-pulse">Cargando directorio de proveedores...</p>
        </div>
      </PageContainer>
    );
  }

  // Error
  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full text-center space-y-6 bg-rose-50/50 p-10 rounded-3xl border border-rose-100 shadow-sm backdrop-blur-sm">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-200/50">
              <IconAlertCircle size={40} stroke={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-rose-900 uppercase tracking-tight">Error de Conexión</h3>
              <p className="text-sm text-rose-700 font-medium leading-relaxed">{error}</p>
            </div>
            <Button 
                onClick={() => fetchProveedores()} 
                className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white border-none shadow-xl shadow-rose-200 font-black uppercase tracking-widest text-[10px]"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Directorio de Proveedores"
        subtitle="Gestiona los proveedores y socios comerciales del sistema"
        icon={<IconTruckDelivery size={24} />}
        actions={
          <Button
            onClick={() => navigate("../proveedores/crear", { relative: "route" })}
            className="w-full sm:w-auto shadow-xl shadow-blue-200"
            leftIcon={<IconPlus size={18} />}
          >
            Nuevo Proveedor
          </Button>
        }
      />

      <div className="space-y-6 pb-24 lg:pb-0">
        {/* Búsqueda */}
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
          <Card.Content className="p-4">
            <div className="relative">
                <Input
                    placeholder="Buscar por nombre, documento o email..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    leftIcon={<IconSearch size={18} className="text-slate-400" />}
                    className="bg-white border-slate-200 focus:border-blue-500 h-12 shadow-sm"
                />
            </div>
          </Card.Content>
        </Card>

        {/* Tabla / Lista */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <Card.Content className="p-0 overflow-x-auto">
            {proveedores.length === 0 ? (
              <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <IconTruckDelivery size={32} stroke={1.5} />
                  </div>
                <p className="text-slate-600 font-black uppercase tracking-tight mb-6">No hay proveedores registrados</p>
                <Button
                  variant="secondary"
                  onClick={() => navigate("../proveedores/crear", { relative: "route" })}
                  leftIcon={<IconPlus size={18} />}
                >
                  Registrar primer proveedor
                </Button>
              </div>
            ) : (
                <div className="min-w-[800px]">
                    <Table>
                        <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Empresa / Nombre
                            </th>
                            <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hidden sm:table-cell">
                            Contacto
                            </th>
                            <th className="text-center py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Estado
                            </th>
                            <th className="text-center py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Acciones
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {proveedores.map((proveedor) => (
                            <tr key={proveedor.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                            {proveedor.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-black text-slate-900 truncate">{proveedor.nombre}</span>
                                            <span className="text-[10px] font-bold text-slate-400 truncate sm:hidden mt-0.5">
                                                {proveedor.telefono || proveedor.email || 'Sin contacto'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 hidden sm:table-cell">
                                    <div className="flex flex-col gap-1.5">
                                        {proveedor.telefono && (
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                <IconPhone size={14} className="text-slate-400 shrink-0" />
                                                <span className="truncate">{proveedor.telefono}</span>
                                            </div>
                                        )}
                                        {proveedor.email && (
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                <IconMail size={14} className="text-slate-400 shrink-0" />
                                                <span className="truncate">{proveedor.email}</span>
                                            </div>
                                        )}
                                        {!proveedor.telefono && !proveedor.email && (
                                            <span className="text-xs text-slate-400 font-medium italic">—</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <Badge variant={proveedor.estado ? "success" : "gray"} className="uppercase tracking-widest text-[9px] font-black">
                                        {proveedor.estado ? "Activo" : "Inactivo"}
                                    </Badge>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => navigate(`../proveedores/${proveedor.id}/editar`, { relative: "route" })}
                                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                            title="Editar Proveedor"
                                        >
                                            <IconEdit size={16} stroke={2.5} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(proveedor.id)}
                                            className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                                            title="Eliminar Proveedor"
                                        >
                                            <IconTrash size={16} stroke={2.5} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </PageContainer>
  );
}
