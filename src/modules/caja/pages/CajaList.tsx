/**
 * Listado de Cajas
 * Permite ver cajas, abrir sesión y ver detalles
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Table, Badge } from "@/shared/components/ui";
import { useCaja } from "../hooks/Usecaja";
import { formatDate } from "../../../shared/utils/formatters";

export default function CajaList() {
  const navigate = useNavigate();

  const { cajas, isLoading, error, fetchCajas, applyFilters } = useCaja();

  const [searchTerm, setSearchTerm] = useState("");

  // cargar cajas
  useEffect(() => {
    fetchCajas();
  }, [fetchCajas]);

  // búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filters = value ? { search: value } : {};
    applyFilters(filters);
  };

  // loading inicial
  if (isLoading && cajas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cajas...</p>
        </div>
      </div>
    );
  }

  // error
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Cajas</h1>
          <Button onClick={() => navigate("/caja/crear")}>Abrir Caja</Button>
        </div>

        <Card>
          <Card.Content>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchCajas()}>Reintentar</Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Cajas</h1>
          <p className="text-gray-600 mt-1">Gestión de cajas del sistema</p>
        </div>

        <Button onClick={() => navigate("/caja/crear")}>Abrir Caja</Button>
      </div>

      {/* Busqueda */}

      <Card>
        <Card.Content>
          <Input
            placeholder="Buscar por nombre de caja..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Card.Content>
      </Card>

      {/* Tabla */}

      <Card>
        <Card.Content className="overflow-x-auto">
          {cajas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay cajas registradas</p>

              <Button className="mt-4" onClick={() => navigate("/caja/crear")}>
                Crear primera caja
              </Button>
            </div>
          ) : (
            <Table>
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Caja
                  </th>

                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Descripción
                  </th>

                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Estado
                  </th>

                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Última apertura
                  </th>

                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {cajas.map((caja) => (
                  <tr key={caja.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {caja.nombre}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {caja.descripcion || "—"}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={caja.esta_abierta ? "success" : "gray"}
                      >
                        {caja.esta_abierta ? "Abierta" : "Cerrada"}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {caja.fecha_creacion
                        ? formatDate(caja.fecha_creacion)
                        : "—"}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {caja.sesion_activa_id && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              navigate(`/caja/sesion/${caja.sesion_activa_id}`)
                            }
                          >
                            Ver Sesión
                          </Button>
                        )}

                        {!caja.esta_abierta && (
                          <Button
                            size="sm"
                            onClick={() => navigate(`/caja/abrir/${caja.id}`)}
                          >
                            Abrir
                          </Button>
                        )}
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
