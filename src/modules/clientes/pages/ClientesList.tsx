/**
 * 📄 PÁGINA: ClienteList
 * Lista de clientes con búsqueda, filtros y acciones responsivas
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Table, Badge, PageContainer, PageHeader } from "@/shared/components/ui";
import { useClientes } from "../hooks/useClientes";
import type { ClienteFilters, EstadoCliente } from "../types";
import { getTipoDocumentoLabel } from "../types";
import { 
    IconUsers, 
    IconPlus, 
    IconSearch, 
    IconLoader2, 
    IconAlertCircle,
    IconUserSearch,
    IconMail,
    IconPhone
} from "@tabler/icons-react";

const estadoVariantMap: Record<EstadoCliente, "success" | "warning" | "danger"> = {
  ACTIVO: "success",
  INACTIVO: "warning",
  BLOQUEADO: "danger"
};

export default function ClienteList() {
  const navigate = useNavigate();
  const { clientes, isLoading, error, fetchClientes, applyFilters } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoCliente | "">("");

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filters: ClienteFilters = {
      ...(value ? { search: value } : {}),
      ...(filtroEstado ? { estado: filtroEstado } : {}),
    };
    applyFilters(filters);
  };

  const handleFiltroEstado = (estado: EstadoCliente | "") => {
    setFiltroEstado(estado);
    const filters: ClienteFilters = {
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(estado ? { estado } : {}),
    };
    applyFilters(filters);
  };

  if (isLoading && clientes.length === 0) {
    return (
      <PageContainer>
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <IconLoader2 className="animate-spin text-accent-600" size={48} stroke={1.5} />
            <p className="text-primary-600 font-black uppercase tracking-widest text-[10px] animate-pulse">Cargando base de clientes...</p>
        </div>
      </PageContainer>
    );
  }

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
                onClick={() => fetchClientes()} 
                className="w-full h-12 bg-danger-600 hover:bg-danger-700 text-white border-none shadow-xl shadow-danger-200 font-black uppercase tracking-widest text-[10px]"
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
      <PageHeader
        title="Directorio de Clientes"
        subtitle="Administra tu base de clientes y su estado"
        icon={<IconUsers size={24} />}
        actions={
          <Button
            onClick={() => navigate("../clientes/crear", { relative: "route" })}
            className="w-full sm:w-auto shadow-xl shadow-accent-200"
            leftIcon={<IconPlus size={18} />}
          >
            Nuevo Cliente
          </Button>
        }
      />

      <div className="space-y-6 pb-24 lg:pb-0">
        <Card className="border-primary-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
          <Card.Content className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <Input
                    placeholder="Buscar por nombre, documento, email..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    leftIcon={<IconSearch size={18} className="text-primary-400" />}
                    className="bg-white border-primary-200 focus:border-accent-500 h-12 shadow-sm"
                />
            </div>
            <div className="md:w-56 shrink-0 relative">
                <select
                    value={filtroEstado}
                    onChange={(e) => handleFiltroEstado(e.target.value as EstadoCliente | "")}
                    className="w-full h-12 px-4 appearance-none font-bold text-sm text-primary-700 bg-white border border-primary-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500 transition-all shadow-sm cursor-pointer"
                >
                    <option value="">TODOS LOS ESTADOS</option>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                    <option value="BLOQUEADO">BLOQUEADO</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="border-primary-200 shadow-sm overflow-hidden">
          <Card.Content className="p-0 overflow-x-auto">
            {clientes.length === 0 ? (
              <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 bg-primary-50 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100">
                      <IconUserSearch size={32} stroke={1.5} />
                  </div>
                <p className="text-primary-600 font-black uppercase tracking-tight mb-6 mt-4">No hay clientes registrados</p>
                <Button
                  variant="secondary"
                  onClick={() => navigate("../clientes/crear", { relative: "route" })}
                  leftIcon={<IconPlus size={18} />}
                >
                  Registrar primer cliente
                </Button>
              </div>
            ) : (
                <div className="min-w-[900px]">
                    <Table>
                        <thead>
                        <tr className="bg-primary-50/50 border-b border-primary-100">
                            <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-primary-500">
                            Cliente
                            </th>
                            <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-primary-500">
                            Identificación
                            </th>
                            <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-primary-500 hidden sm:table-cell">
                            Contacto
                            </th>
                            <th className="text-center py-4 px-6 text-[10px] font-black uppercase tracking-widest text-primary-500">
                            Estado
                            </th>
                            <th className="text-center py-4 px-6 text-[10px] font-black uppercase tracking-widest text-primary-500">
                            Acciones
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-100">
                        {clientes.map((cliente) => (
                            <tr key={cliente.id} className="hover:bg-accent-50/30 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-500 shrink-0 border border-primary-200 group-hover:bg-white group-hover:text-accent-600 transition-colors">
                                            {cliente.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-black text-primary-900 truncate">{cliente.nombre}</span>
                                            <span className="text-[10px] font-bold text-primary-400 truncate sm:hidden mt-0.5">
                                                {cliente.telefono || cliente.email || 'Sin contacto'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-primary-500 uppercase tracking-tight">{getTipoDocumentoLabel(cliente.tipo_documento)}</span>
                                        <span className="font-medium text-primary-900">{cliente.numero_documento}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 hidden sm:table-cell">
                                    <div className="flex flex-col gap-1.5">
                                        {cliente.telefono && (
                                            <div className="flex items-center gap-2 text-xs text-primary-600 font-medium">
                                                <IconPhone size={14} className="text-primary-400 shrink-0" />
                                                <span className="truncate">{cliente.telefono}</span>
                                            </div>
                                        )}
                                        {cliente.email && (
                                            <div className="flex items-center gap-2 text-xs text-primary-600 font-medium">
                                                <IconMail size={14} className="text-primary-400 shrink-0" />
                                                <span className="truncate">{cliente.email}</span>
                                            </div>
                                        )}
                                        {!cliente.telefono && !cliente.email && (
                                            <span className="text-xs text-primary-400 font-medium italic">—</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <Badge variant={estadoVariantMap[cliente.estado]} className="uppercase tracking-widest text-[9px] font-black">
                                        {cliente.estado}
                                    </Badge>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex gap-2 justify-center">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => navigate(`../clientes/${cliente.id}/detalle`, { relative: "route" })}
                                            className="h-8 text-[10px] font-black uppercase tracking-widest shadow-sm"
                                        >
                                            Ver detalle
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => navigate(`../clientes/${cliente.id}/editar`, { relative: "route" })}
                                            className="h-8 text-[10px] font-black uppercase tracking-widest shadow-sm shadow-accent-200"
                                        >
                                            Editar
                                        </Button>
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
