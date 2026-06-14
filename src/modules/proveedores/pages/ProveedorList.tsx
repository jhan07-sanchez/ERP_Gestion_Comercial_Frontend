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
import { useDebounceValue } from "@/shared/hooks";
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
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  // Cargar proveedores al montar
  useEffect(() => {
    fetchProveedores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efecto para la búsqueda con debounce
  useEffect(() => {
    const filters: ProveedorFilters = debouncedSearchTerm ? { search: debouncedSearchTerm } : {};
    applyFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  // Manejador del input de búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
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
            <IconLoader2 className="animate-spin text-accent-600" size={48} stroke={1.5} />
            <p className="text-primary-600 font-black uppercase tracking-widest text-xs animate-pulse">Cargando directorio de proveedores...</p>
        </div>
      </PageContainer>
    );
  }

  // Error
  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full text-center space-y-6 bg-danger-50/50 p-10 rounded-3xl border border-danger-100 shadow-sm backdrop-blur-sm">
            <div className="w-20 h-20 bg-danger-100 text-danger-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-danger-200/50">
              <IconAlertCircle size={40} stroke={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-danger-900 uppercase tracking-tight">Error de Conexión</h3>
              <p className="text-sm text-danger-700 font-medium leading-relaxed">{error}</p>
            </div>
            <Button 
                onClick={() => fetchProveedores()} 
                className="w-full h-12 bg-danger-600 hover:bg-danger-700 text-white border-none shadow-xl shadow-danger-200 font-black uppercase tracking-widest text-xs"
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
            className="w-full sm:w-auto shadow-xl shadow-accent-200"
            leftIcon={<IconPlus size={18} />}
          >
            Nuevo Proveedor
          </Button>
        }
      />

      <div className="space-y-6 pb-24 lg:pb-0">
        {/* Búsqueda */}
        <Card className="border-primary-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
          <Card.Content className="p-4">
            <div className="relative">
                <Input
                    placeholder="Buscar por nombre, documento o email..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    leftIcon={<IconSearch size={18} className="text-primary-400" />}
                    className="bg-white border-primary-200 focus:border-accent-500 h-12 shadow-sm"
                />
            </div>
          </Card.Content>
        </Card>

        {/* Tabla / Lista */}
        <Card className="border-primary-200 shadow-sm overflow-hidden">
          <Card.Content className="p-0 overflow-x-auto">
            {proveedores.length === 0 ? (
              <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 bg-primary-50 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100">
                      <IconTruckDelivery size={32} stroke={1.5} />
                  </div>
                <p className="text-primary-600 font-black uppercase tracking-tight mb-6">No hay proveedores registrados</p>
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
                        <tr className="bg-primary-50/50 border-b border-primary-100">
                            <th className="text-left py-4 px-6 text-xs font-black uppercase tracking-widest text-primary-500">
                            Empresa / Nombre
                            </th>
                            <th className="text-left py-4 px-6 text-xs font-black uppercase tracking-widest text-primary-500 hidden sm:table-cell">
                            Contacto
                            </th>
                            <th className="text-center py-4 px-6 text-xs font-black uppercase tracking-widest text-primary-500">
                            Estado
                            </th>
                            <th className="text-center py-4 px-6 text-xs font-black uppercase tracking-widest text-primary-500">
                            Acciones
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-100">
                        {proveedores.map((proveedor) => (
                            <tr key={proveedor.id} className="hover:bg-accent-50/30 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-500 shrink-0 border border-primary-200 group-hover:bg-white group-hover:text-accent-600 transition-colors">
                                            {proveedor.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-black text-primary-900 truncate">{proveedor.nombre}</span>
                                            <span className="text-xs font-bold text-primary-400 truncate sm:hidden mt-0.5">
                                                {proveedor.telefono || proveedor.email || 'Sin contacto'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 hidden sm:table-cell">
                                    <div className="flex flex-col gap-1.5">
                                        {proveedor.telefono && (
                                            <div className="flex items-center gap-2 text-xs text-primary-600 font-medium">
                                                <IconPhone size={14} className="text-primary-400 shrink-0" />
                                                <span className="truncate">{proveedor.telefono}</span>
                                            </div>
                                        )}
                                        {proveedor.email && (
                                            <div className="flex items-center gap-2 text-xs text-primary-600 font-medium">
                                                <IconMail size={14} className="text-primary-400 shrink-0" />
                                                <span className="truncate">{proveedor.email}</span>
                                            </div>
                                        )}
                                        {!proveedor.telefono && !proveedor.email && (
                                            <span className="text-xs text-primary-400 font-medium italic">—</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <Badge variant={proveedor.estado ? "success" : "gray"} className="uppercase tracking-widest text-xs opacity-80 font-black">
                                        {proveedor.estado ? "Activo" : "Inactivo"}
                                    </Badge>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => navigate(`../proveedores/${proveedor.id}/editar`, { relative: "route" })}
                                            className="p-2 text-accent-600 bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors"
                                            title="Editar Proveedor"
                                        >
                                            <IconEdit size={16} stroke={2.5} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(proveedor.id)}
                                            className="p-2 text-danger-600 bg-danger-50 hover:bg-danger-100 rounded-lg transition-colors"
                                            title="Eliminar Proveedor"
                                        >
                                            <IconTrash size={16} stroke={2.5} />
                                        </button>
                                        <button
                                            onClick={() => navigate(`../proveedores/${proveedor.id}`, { relative: "route" })}
                                            className="p-2 text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                                            title="Ver Detalles"
                                        >
                                            <IconSearch size={16} stroke={2.5} />
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
