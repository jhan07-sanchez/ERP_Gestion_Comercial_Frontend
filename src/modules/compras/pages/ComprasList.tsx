// src/modules/compras/pages/ComprasList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Table } from "@/components/ui";
import { useCompras } from "../hooks/useCompras";
import { Compra } from "../types";

// Formateador simple de moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ComprasList() {
  const navigate = useNavigate();
  const { compras, count, loading, error, fetchCompras } = useCompras();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchCompras({ page, page_size: PAGE_SIZE });
  }, [page]);

  // Mensaje de bienvenida para primera vez
  if (compras.length === 0 && !loading && !error && count === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="text-8xl mb-6">📦</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Bienvenido al Módulo de Compras!
        </h1>
        <p className="text-gray-600 max-w-md mb-8">
          Este es tu primer acceso al módulo de compras. Para empezar, registra
          tu primera compra a un proveedor.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate("/compras/nueva")}
          className="px-8 py-4 text-lg"
        >
          + Registrar Primera Compra
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Compras a Proveedores
          </h1>
          <p className="text-gray-600 mt-1">
            Registra y gestiona todas las compras realizadas
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/compras/nueva")}
          className="px-6 py-2.5"
        >
          + Nueva Compra
        </Button>
      </div>

      {/* Contenido */}
      <Card>
        <Card.Content>
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium flex items-center gap-2">
                <span>⚠️</span> {error}
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Cargando compras...</p>
            </div>
          ) : compras.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-500 text-lg">
                No hay compras registradas
              </p>
              <Button
                variant="secondary"
                className="mt-6 px-8 py-3"
                onClick={() => navigate("/compras/nueva")}
              >
                Registrar Primera Compra
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>ID</Table.Head>
                      <Table.Head>Proveedor</Table.Head>
                      <Table.Head>Fecha</Table.Head>
                      <Table.Head>Total</Table.Head>
                      <Table.Head>Acciones</Table.Head>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {compras.map((compra) => (
                      <Table.Row key={compra.id}>
                        <Table.Cell className="font-mono">
                          #{compra.id}
                        </Table.Cell>
                        <Table.Cell className="font-medium">
                          {compra.proveedor_nombre ||
                            "Proveedor no identificado"}
                        </Table.Cell>
                        <Table.Cell>
                          {new Date(compra.fecha).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Table.Cell>
                        <Table.Cell className="font-bold text-green-700">
                          {formatCurrency(compra.total)}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                navigate(`/compras/${compra.id}/editar`)
                              }
                            >
                              Ver
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              {/* Paginación */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Mostrando {Math.min((page - 1) * PAGE_SIZE + 1, count)} -{" "}
                  {Math.min(page * PAGE_SIZE, count)} de {count} compras
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page * PAGE_SIZE >= count}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
