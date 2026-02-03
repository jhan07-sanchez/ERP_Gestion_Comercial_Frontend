/**
 * Listado de productos (inventario).
 * Muestra tabla con todos los productos y acciones para crear, editar, eliminar
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Table, Badge } from "@/components/ui";
import { useProductos } from "../hooks/useProductos";
import type { ProductoFilters } from "../types";

export default function ProductosList() {
  const navigate = useNavigate();
  const {
    productos,
    isLoading,
    error,
    fetchProductos,
    deleteProducto,
    applyFilters,
  } = useProductos();
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Manejar búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filters: ProductoFilters = value ? { search: value } : {};
    applyFilters(filters);
  };

  // Manejar eliminación
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProducto(id);
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  if (isLoading && productos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <Button onClick={() => navigate("/inventario/productos/crear")}>
            Nuevo Producto
          </Button>
        </div>

        <Card>
          <Card.Content>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchProductos()}>Reintentar</Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el inventario de productos
          </p>
        </div>
        <Button
          onClick={() => navigate("../productos/crear", { relative: "route" })}
        >
          Nuevo Producto
        </Button>
      </div>

      {/* Búsqueda */}
      <Card>
        <Card.Content>
          <Input
            placeholder="Buscar por nombre, código o descripción..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Card.Content>
      </Card>

      {/* Tabla de productos */}
      <Card>
        <Card.Content className="overflow-x-auto">
          {productos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay productos disponibles</p>
              <Button
                className="mt-4"
                onClick={() =>
                  navigate("../productos/crear", { relative: "route" })
                }
              >
                Crear primer producto
              </Button>
            </div>
          ) : (
            <Table>
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Código
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Nombre
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Categoría
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Precio Venta
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Stock
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Estado
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">
                      {producto.codigo}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {producto.nombre}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {producto.categoria_info?.nombre || "Sin categoría"}
                    </td>

                    <td className="py-3 px-4 text-right text-gray-900">
                      ${producto.precio_venta.toLocaleString("es-CO")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          (producto.stock_actual || 0) <= producto.stock_minimo
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {producto.stock_actual || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={producto.estado ? "success" : "danger"}>
                        {producto.estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`../productos/${producto.id}/editar`, {
                              relative: "route",
                            })
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(producto.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
