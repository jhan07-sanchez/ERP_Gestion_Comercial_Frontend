/**
 * Listado de compras.
 * Muestra tabla con todas las compras y acciones para crear, editar, eliminar
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Table, Badge } from "@/components/ui";
import { useCompras } from "../hooks/useCompras";
import type { CompraFilters } from "../types";

export default function ComprasList() {
  const navigate = useNavigate();

  const {
    compras,
    isLoading,
    error,
    fetchCompras,
    deleteCompra,
    applyFilters,
  } = useCompras();

  const [searchTerm, setSearchTerm] = useState("");

  // Cargar compras al montar
  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);

  // Búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filters: CompraFilters = value ? { search: value } : {};
    applyFilters(filters);
  };

  // Eliminación
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta compra?")) {
      try {
        await deleteCompra(id);
      } catch (err) {
        console.error("Error al eliminar compra:", err);
      }
    }
  };

  // Loading inicial
  if (isLoading && compras.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando compras...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Compras</h1>
          <Button onClick={() => navigate("/compras/crear")}>
            Nueva Compra
          </Button>
        </div>

        <Card>
          <Card.Content>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchCompras()}>Reintentar</Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Compras</h1>
          <p className="text-gray-600 mt-1">
            Gestiona las compras realizadas a proveedores
          </p>
        </div>
        <Button
          onClick={() => navigate("../compras/crear", { relative: "route" })}
        >
          Nueva Compra
        </Button>
      </div>

      {/* Búsqueda */}
      <Card>
        <Card.Content>
          <Input
            placeholder="Buscar por proveedor, fecha o número de compra..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Card.Content>
      </Card>

      {/* Tabla */}
      <Card>
        <Card.Content className="overflow-x-auto">
          {compras.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay compras registradas</p>
              <Button
                className="mt-4"
                onClick={() =>
                  navigate("../compras/crear", { relative: "route" })
                }
              >
                Registrar primera compra
              </Button>
            </div>
          ) : (
            <Table>
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Nº
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Proveedor
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Fecha
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Total
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
                {compras.map((compra) => (
                  <tr key={compra.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{compra.id}</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {compra.proveedor_info?.nombre || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(compra.fecha).toLocaleDateString("es-CO")}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      ${compra.total.toLocaleString("es-CO")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={compra.estado ? "success" : "danger"}>
                        {compra.estado ? "Confirmada" : "Anulada"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`../compras/${compra.id}/editar`, {
                              relative: "route",
                            })
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(compra.id)}
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
