/**
 * 📄 PÁGINA: VentasList
 * Lista de ventas con búsqueda, filtros y acciones
 * Mismo patrón que ComprasList.tsx
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Table, Badge } from "@/components/ui";
import { useVentas } from "../hooks/useVenta";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { EstadoVenta, VentaFilters } from "../types/venta.types";
import { useAlert } from "@/components/alerts";

const estadoVariantMap: Record<EstadoVenta, "success" | "warning" | "danger"> =
{
  COMPLETADA: "success",
  PARCIAL: "warning",
  PENDIENTE: "warning",
  CANCELADA: "danger",
};

export default function VentasList() {
  const navigate = useNavigate();

  const {
    ventas,
    isLoading,
    error,
    fetchVentas,
    applyFilters,
    cancelarVenta,
    loadingCancelar,
  } = useVentas();
  const { showAlert, prompt } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoVenta | "">("");

  // Cargar ventas al montar
  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  // Búsqueda por texto
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filters: VentaFilters = {
      ...(value ? { search: value } : {}),
      ...(filtroEstado ? { estado: filtroEstado } : {}),
    };
    applyFilters(filters);
  };

  // Filtro por estado
  const handleFiltroEstado = (estado: EstadoVenta | "") => {
    setFiltroEstado(estado);
    const filters: VentaFilters = {
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(estado ? { estado } : {}),
    };
    applyFilters(filters);
  };



  // Cancelar venta
  const handleCancelar = async (id: number) => {
    const motivo = await prompt("Cancelar Venta", "Por favor, ingresa el motivo de la cancelación:", "");

    if (motivo === null) return; // Usuario canceló

    if (!motivo.trim()) {
      showAlert("Validación", "warning", { description: "Debes ingresar un motivo para cancelar la venta." });
      return;
    }

    await cancelarVenta(id, motivo);
    showAlert("Venta Cancelada", "info");
    fetchVentas();
  };

  // ─── Loading inicial ──────────────────────────────────────────────────
  if (isLoading && ventas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando ventas...</p>
        </div>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
          <Button
            onClick={() => navigate("../ventas/crear", { relative: "route" })}
          >
            Nueva Venta
          </Button>
        </div>
        <Card>
          <Card.Content>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchVentas()}>Reintentar</Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
          <p className="text-gray-600 mt-1">
            Gestiona las ventas realizadas a clientes
          </p>
        </div>
        <Button
          onClick={() => navigate("../ventas/crear", { relative: "route" })}
        >
          Nueva Venta
        </Button>
      </div>

      {/* ── Filtros ─────────────────────────────────────────────────────── */}
      <Card>
        <Card.Content className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por cliente, número de venta..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="md:w-48">
            <select
              value={filtroEstado}
              onChange={(e) =>
                handleFiltroEstado(e.target.value as EstadoVenta | "")
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="PARCIAL">Parcial</option>
              <option value="COMPLETADA">Completada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>
        </Card.Content>
      </Card>

      {/* ── Tabla ──────────────────────────────────────────────────────── */}
      <Card>
        <Card.Content className="overflow-x-auto">
          {ventas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay ventas registradas</p>
              <Button
                className="mt-4"
                onClick={() =>
                  navigate("../ventas/crear", { relative: "route" })
                }
              >
                Registrar primera venta
              </Button>
            </div>
          ) : (
            <Table>
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Fecha
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Productos
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Total
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Pagado
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Saldo
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
                {ventas.map((venta) => (
                  <tr key={venta.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600 font-mono text-sm">
                      #{venta.id}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">
                        {venta.cliente_nombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        {venta.cliente_documento}
                      </p>
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(venta.fecha)}
                    </td>

                    <td className="py-3 px-4 text-center text-gray-600">
                      {venta.total_productos}
                    </td>

                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      {formatCurrency(venta.total)}
                    </td>

                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatCurrency(venta.total_pagado)}
                    </td>

                    <td className="py-3 px-4 text-right font-semibold text-orange-600">
                      {formatCurrency(venta.saldo_pendiente)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <Badge variant={estadoVariantMap[venta.estado]}>
                        {venta.estado}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {/* Ver detalle - siempre */}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            navigate(`../ventas/${venta.id}/detalle`, {
                              relative: "route",
                            })
                          }
                        >
                          Ver detalle
                        </Button>

                        {/* Editar - solo PENDIENTE */}
                        {venta.estado === "PENDIENTE" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(`../ventas/${venta.id}/editar`, {
                                relative: "route",
                              })
                            }
                          >
                            Editar
                          </Button>
                        )}

                        {/* Completar - Removido del listado rápido para forzar paso por Modal en detalle */}
                        {(venta.estado === "PENDIENTE" || venta.estado === "PARCIAL") && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => navigate(`../ventas/${venta.id}/detalle`, { relative: "route" })}
                          >
                            Registrar Pago
                          </Button>
                        )}

                        {/* Cancelar - solo si no está cancelada */}
                        {venta.estado !== "CANCELADA" && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleCancelar(venta.id)}
                            isLoading={loadingCancelar}
                          >
                            Cancelar
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
