import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Table, Badge, PageContainer, PageHeader } from "@/shared/components/ui";
import { useSuscripcion } from "@/modules/auth/hooks/useSuscripcion";
import { useProductosList, useProductoActions } from "../hooks";
import type { ProductoFilters } from "../types";
import { formatCurrency } from "@/shared/utils/formatters";
import { useAlert } from "@/shared/components/alerts";
import { useDebounceValue } from "@/shared/hooks";
import {
  IconPackage,
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconTag
} from "@tabler/icons-react";

export default function ProductosList() {
  const navigate = useNavigate();
  const {
    productos,
    isLoading,
    error,
    fetchProductos,
    applyFilters,
  } = useProductosList();
  const { showAlert, confirm } = useAlert();
  const { isReadOnly } = useSuscripcion();

  const { deleteProducto } = useProductoActions(async () => {
    await fetchProductos();
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  // La carga inicial y persistencia están ahora centralizadas en useProductosList

  // Efecto para la búsqueda con debounce
  useEffect(() => {
    const filters: ProductoFilters = debouncedSearchTerm ? { search: debouncedSearchTerm } : {};
    applyFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDelete = async (id: number) => {
    const confirmar = await confirm(
      "Eliminar Producto",
      "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.",
      "critical"
    );

    if (confirmar) {
      try {
        await deleteProducto(id);
        showAlert("Producto Eliminado", "success");
      } catch (err) {
        console.error("Error al eliminar:", err);
        showAlert("Error", "error", { description: "No se pudo eliminar el producto." });
      }
    }
  };

  if (isLoading && productos.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Productos"
          subtitle="Gestiona el catálogo de productos y servicios"
          icon={<IconPackage size={24} />}
        />
        <div className="flex flex-col items-center justify-center min-h-96 bg-white rounded-xl border border-primary-100 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-primary-600 font-medium">Cargando catálogo...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Productos"
        subtitle="Gestiona el catálogo de productos y servicios"
        icon={<IconPackage size={24} />}
        actions={
          <Button
            onClick={() => navigate("/productos/crear")}
            disabled={isReadOnly}
            className="w-full sm:w-auto shadow-lg shadow-primary-100"
            title={
              isReadOnly
                ? "Acción bloqueada por suscripción expirada"
                : "Nuevo Producto"
            }
          >
            <IconPlus size={18} className="mr-2" />
            Nuevo Producto
          </Button>
        }
      />

      {error ? (
        <Card className="border-danger-100 bg-danger-50/30">
          <Card.Content className="p-6 text-center">
            <IconAlertCircle
              className="mx-auto text-danger-500 mb-2"
              size={32}
            />
            <p className="text-danger-600 font-medium mb-4">{error}</p>
            <Button onClick={() => fetchProductos()} variant="secondary">
              Reintentar
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <>
          {/* Búsqueda */}
          <Card className="shadow-sm border-primary-100 overflow-hidden">
            <Card.Content className="p-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-400">
                  <IconSearch size={18} />
                </div>
                <Input
                  placeholder="Buscar por nombre, código o descripción..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-primary-50/30 border-primary-100 focus:bg-white transition-all"
                />
              </div>
            </Card.Content>
          </Card>

          {/* Tabla de productos */}
          <Card className="shadow-sm border-primary-100 overflow-hidden">
            <Card.Content className="p-0">
              {productos.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-400">
                    <IconPackage size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-primary-900">
                    No hay productos
                  </h3>
                  <p className="text-primary-500 text-sm max-w-xs mx-auto mt-1 mb-6">
                    Aún no has registrado productos. Comienza creando uno ahora
                    mismo.
                  </p>
                  <Button onClick={() => navigate("/productos/crear")}>
                    Crear primer producto
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.Head className="w-[120px]">Código</Table.Head>
                        <Table.Head>Producto</Table.Head>
                        <Table.Head className="hidden md:table-cell">
                          Categoría
                        </Table.Head>
                        <Table.Head className="text-right">Precio</Table.Head>
                        <Table.Head className="text-center">Stock</Table.Head>
                        <Table.Head className="text-center w-[100px]">
                          Estado
                        </Table.Head>
                        <Table.Head className="text-right w-[100px]">
                          Acciones
                        </Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {productos.map((producto) => (
                        <Table.Row
                          key={producto.id}
                          className="hover:bg-primary-50/20"
                        >
                          <Table.Cell>
                            <span className="font-mono text-xs font-bold text-primary-400 bg-primary-50 px-2 py-0.5 rounded border border-primary-100 uppercase tracking-tighter">
                              <span>{producto.codigo || "S/C"}</span>
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex flex-col">
                              <span className="font-bold text-primary-900 leading-tight">
                                <span>{producto.nombre}</span>
                              </span>
                              <span className="text-xs text-primary-400 md:hidden italic">
                                <span>
                                  {producto.categoria_info?.nombre || "General"}
                                </span>
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="hidden md:table-cell">
                            <div className="flex items-center gap-1.5 text-xs text-primary-600 font-medium">
                              <IconTag size={12} className="text-primary-400" />
                              <span>
                                {producto.categoria_info?.nombre ||
                                  "Sin categoría"}
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="text-right font-black text-primary-900">
                            <span>{formatCurrency(producto.precio_venta)}</span>
                          </Table.Cell>
                          <Table.Cell className="text-center">
                            <span
                              className={`inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-lg text-xs font-black ${
                                (producto.stock_actual || 0) <=
                                (producto.stock_minimo || 0)
                                  ? "bg-danger-100 text-danger-700 border border-danger-200"
                                  : "bg-success-100 text-success-700 border border-success-200"
                              }`}
                            >
                              <span>{producto.stock_actual || 0}</span>
                            </span>
                          </Table.Cell>
                          <Table.Cell className="text-center">
                            <Badge
                              variant={producto.estado ? "success" : "danger"}
                              className="text-xs opacity-80 uppercase font-black px-2"
                            >
                              {producto.estado ? "Activo" : "Inactivo"}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                iconOnly
                                onClick={() =>
                                  navigate(`/productos/${producto.id}/editar`)
                                }
                                title="Editar"
                              >
                                <IconEdit size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                iconOnly
                                disabled={isReadOnly}
                                onClick={() => handleDelete(producto.id)}
                                className="bg-danger-50 text-danger-600 hover:bg-danger-600 hover:text-white border-none"
                                title={
                                  isReadOnly ? "Acción bloqueada" : "Eliminar"
                                }
                              >
                                <IconTrash size={14} />
                              </Button>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              )}
            </Card.Content>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
