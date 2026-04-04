/**
 * 📄 PÁGINA: CategoriasList
 * Gestión de categorías del catálogo con diseño responsivo
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Input,
  Table,
  Badge,
  PageContainer,
  PageHeader,
} from "@/shared/components/ui";
import { useCategorias } from "../hooks/useCategorias";
import { useAlert } from "@/shared/components/alerts";
import {
  IconTags,
  IconSearch,
  IconPlus,
  IconLoader2,
  IconAlertCircle,
  IconEdit,
  IconTrash,
  IconTagOff,
} from "@tabler/icons-react";

export default function CategoriasList() {
  const navigate = useNavigate();
  const { categorias, isLoading, error, fetchCategorias, deleteCategoria } =
    useCategorias();
  const { showAlert, confirm } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const filteredCategorias = categorias.filter(
    (cat) =>
      cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    const confirmar = await confirm(
      "Eliminar Categoría",
      "¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.",
      "critical",
    );

    if (confirmar) {
      try {
        await deleteCategoria(id);
        showAlert("Categoría Eliminada", "success");
      } catch (err) {
        console.error("Error al eliminar categoría:", err);
        showAlert("Error", "error", {
          description: "No se pudo eliminar la categoría.",
        });
      }
    }
  };

  if (isLoading && categorias.length === 0) {
    return (
      <PageContainer>
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
          <IconLoader2
            className="animate-spin text-blue-600"
            size={48}
            stroke={1.5}
          />
          <p className="text-slate-600 font-black uppercase tracking-widest text-[10px] animate-pulse">
            Cargando catálogo de categorías...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full text-center space-y-6 bg-rose-50/50 p-10 rounded-3xl border border-rose-100 shadow-sm backdrop-blur-sm">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-200/50">
              <IconAlertCircle size={40} stroke={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-rose-900 uppercase tracking-tight">
                Error de Conexión
              </h3>
              <p className="text-sm text-rose-700 font-medium leading-relaxed">
                {error}
              </p>
            </div>
            <Button
              onClick={() => fetchCategorias()}
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
      <PageHeader
        title="Gestión de Categorías"
        subtitle="Clasificación de productos del catálogo web"
        icon={<IconTags size={24} />}
        actions={
          <Button
            onClick={() => navigate("/categorias/crear")}
            className="w-full sm:w-auto shadow-xl shadow-blue-200"
            leftIcon={<IconPlus size={18} />}
          >
            Nueva Categoría
          </Button>
        }
      />

      <div className="space-y-6 pb-24 lg:pb-0">
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
          <Card.Content className="p-4">
            <div className="relative">
              <Input
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<IconSearch size={18} className="text-slate-400" />}
                className="bg-white border-slate-200 focus:border-blue-500 h-12 shadow-sm"
              />
            </div>
          </Card.Content>
        </Card>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <Card.Content className="p-0 overflow-x-auto">
            {filteredCategorias.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <IconTagOff size={32} stroke={1.5} />
                </div>
                <p className="text-slate-600 font-black uppercase tracking-tight mb-2">
                  No se encontraron categorías
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Revisa el término de búsqueda o crea una nueva.
                </p>
              </div>
            ) : (
              <div className="min-w-[600px]">
                <Table>
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 w-1/3">
                        Nombre
                      </th>
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hidden sm:table-cell">
                        Descripción
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 w-32">
                        Estado
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 w-32">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCategorias.map((categoria) => (
                      <tr
                        key={categoria.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                              <IconTags size={20} stroke={1.5} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-black text-slate-900 truncate">
                                {categoria.nombre}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 truncate sm:hidden mt-0.5">
                                {categoria.descripcion || "Sin descripción"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell text-sm text-slate-600 font-medium">
                          {categoria.descripcion || (
                            <span className="text-slate-400 italic">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Badge
                            variant={categoria.estado ? "success" : "danger"}
                            className="uppercase tracking-widest text-[9px] font-black"
                          >
                            {categoria.estado ? "Activa" : "Inactiva"}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                showAlert("En Desarrollo", "info", {
                                  description:
                                    "La función de editar estará disponible pronto.",
                                })
                              }
                              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Editar Categoría"
                            >
                              <IconEdit size={16} stroke={2.5} />
                            </button>
                            <button
                              onClick={() => handleDelete(categoria.id)}
                              className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Eliminar Categoría"
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
