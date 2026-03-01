/**
 * 📄 PÁGINA: ClienteList
 * Lista de clientes con búsqueda, filtros y acciones
 * Mismo patrón que VentasList.tsx
 */

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Card, Button, Input, Table, Badge } from "@/components/ui";

import { useClientes } from "../hooks/useClientes";

import type { ClienteFilters, EstadoCliente } from "../types";
import { getTipoDocumentoLabel } from "../types";

// Mapeo estado → variante Badge
const estadoVariantMap: Record<
  EstadoCliente,
  "success" | "warning" | "danger"
> = {
  ACTIVO: "success",
  INACTIVO: "warning",
  BLOQUEADO: "danger"
};

export default function ClienteList() {
  const navigate = useNavigate();

  const { clientes, isLoading, error, fetchClientes, applyFilters } =
    useClientes();

  const [searchTerm, setSearchTerm] = useState("");

  const [filtroEstado, setFiltroEstado] = useState<EstadoCliente | "">("");

  // ─── Cargar clientes al montar ───────────────────────────────────
  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  // ─── Búsqueda ────────────────────────────────────────────────────
  const handleSearch = (value: string) => {
    setSearchTerm(value);

    const filters: ClienteFilters = {
      ...(value ? { search: value } : {}),

      ...(filtroEstado ? { estado: filtroEstado } : {}),
    };

    applyFilters(filters);
  };

  // ─── Filtro estado ───────────────────────────────────────────────
  const handleFiltroEstado = (estado: EstadoCliente | "") => {
    setFiltroEstado(estado);

    const filters: ClienteFilters = {
      ...(searchTerm ? { search: searchTerm } : {}),

      ...(estado ? { estado } : {}),
    };

    applyFilters(filters);
  };

  // ─── Loading inicial ─────────────────────────────────────────────
  if (isLoading && clientes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />

          <p className="mt-4 text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  // ─── Error ───────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>

          <Button
            onClick={() => navigate("../clientes/crear", { relative: "route" })}
          >
            Nuevo Cliente
          </Button>
        </div>

        <Card>
          <Card.Content>
            <p className="text-red-600 mb-4">{error}</p>

            <Button onClick={() => fetchClientes()}>Reintentar</Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>

          <p className="text-gray-600 mt-1">
            Gestiona los clientes del sistema
          </p>
        </div>

        <Button
          onClick={() => navigate("../clientes/crear", { relative: "route" })}
        >
          Nuevo Cliente
        </Button>
      </div>

      {/* Filtros */}

      <Card>
        <Card.Content className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, documento, email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="md:w-48">
            <select
              value={filtroEstado}
              onChange={(e) =>
                handleFiltroEstado(e.target.value as EstadoCliente | "")
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm"
            >
              <option value="">Todos los estados</option>

              <option value="ACTIVO">Activo</option>

              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>
        </Card.Content>
      </Card>

      {/* Tabla */}

      <Card>
        <Card.Content className="overflow-x-auto">
          {clientes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay clientes registrados</p>

              <Button
                className="mt-4"
                onClick={() =>
                  navigate("../clientes/crear", {
                    relative: "route",
                  })
                }
              >
                Registrar primer cliente
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
                    Tipo documento
                  </th>

                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Nº documento
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
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b hover:bg-gray-50">

                    <td className="py-3 px-4 font-medium text-gray-900">
                      {cliente.nombre}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {getTipoDocumentoLabel(cliente.tipo_documento)}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {cliente.numero_documento}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {cliente.telefono || "-"}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {cliente.email || "-"}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <Badge variant={estadoVariantMap[cliente.estado]}>
                        {cliente.estado}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            navigate(`../clientes/${cliente.id}/detalle`, {
                              relative: "route",
                            })
                          }
                        >
                          Ver detalle
                        </Button>

                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`../clientes/${cliente.id}/editar`, {
                              relative: "route",
                            })
                          }
                        >
                          Editar
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
