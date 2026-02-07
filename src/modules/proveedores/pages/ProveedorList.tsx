/**
 * Listado de proveedores.
 * Muestra tabla con todos los proveedores y acciones CRUD
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Table, Badge } from "@/components/ui";
import { useProveedor } from "../hooks/useProveedor";
import type { ProveedorFilters } from "../types/proveedor.types";

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
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")
    ) {
      try {
        await deleteProveedor(id);
      } catch (err) {
        console.error("Error al eliminar proveedor:", err);
      }
    }
  };

  // Loading inicial
  if (isLoading && proveedores.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
          <Button onClick={() => navigate("/proveedores/crear")}>
            Nuevo Proveedor
          </Button>
        </div>

        <Card>
          <Card.Content>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchProveedores()}>Reintentar</Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los proveedores del sistema
          </p>
        </div>
        <Button
          onClick={() =>
            navigate("../proveedores/crear", { relative: "route" })
          }
        >
          Nuevo Proveedor
        </Button>
      </div>

      {/* Búsqueda */}
      <Card>
        <Card.Content>
          <Input
            placeholder="Buscar por nombre, documento o email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Card.Content>
      </Card>

      {/* Tabla */}
      <Card>
        <Card.Content className="overflow-x-auto">
          {proveedores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay proveedores registrados</p>
              <Button
                className="mt-4"
                onClick={() =>
                  navigate("../proveedores/crear", { relative: "route" })
                }
              >
                Registrar primer proveedor
              </Button>
            </div>
          ) : (
            <Table>
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Nombre
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Teléfono
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Email
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
                {proveedores.map((proveedor) => (
                  <tr key={proveedor.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {proveedor.nombre}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {proveedor.telefono || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {proveedor.email || "—"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={proveedor.estado ? "success" : "danger"}>
                        {proveedor.estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`../proveedores/${proveedor.id}/editar`, {
                              relative: "route",
                            })
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(proveedor.id)}
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
