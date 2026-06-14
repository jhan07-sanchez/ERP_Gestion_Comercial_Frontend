import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Badge, PageContainer, PageHeader, Table } from "@/shared/components/ui";
import { useVentas } from "../hooks/useVenta";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import type { EstadoVenta, VentaFilters } from "../types/venta.types";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { IconReceipt, IconPlus, IconSearch, IconFilter } from "@tabler/icons-react";
import { useDebounceValue } from "@/shared/hooks";

const estadoVariantMap: Record<EstadoVenta, "success" | "warning" | "danger"> = {
  COMPLETADA: "success",
  PARCIAL: "warning",
  PENDIENTE: "warning",
  CANCELADA: "danger",
};

export default function VentasList() {
  const navigate = useNavigate();
  const { ventas, isLoading, error, fetchVentas, applyFilters, cancelarVenta, loadingCancelar } = useVentas();
  const { isCajaAbierta } = useCajaStore();
  const { showAlert, prompt } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);
  const [filtroEstado, setFiltroEstado] = useState<EstadoVenta | "">("");

  useEffect(() => {
    fetchVentas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efecto para aplicar filtros con debounce en búsqueda y cambios de estado
  const isFirstFilterRender = useRef(true);

  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }

    const normalizedSearch = debouncedSearchTerm.trim();
    const filters: VentaFilters = {
      ...(normalizedSearch ? { search: normalizedSearch } : {}),
      ...(filtroEstado ? { estado: filtroEstado } : {}),
    };
    applyFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filtroEstado]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFiltroEstado = (estado: EstadoVenta | "") => {
    setFiltroEstado(estado);
  };

  const handleCancelar = async (id: number) => {
    const motivo = await prompt("Cancelar Venta", "Por favor, ingresa el motivo de la cancelación:", "");
    if (motivo === null) return;
    if (!motivo.trim()) {
      showAlert("Validación", "warning", { description: "Debes ingresar un motivo para cancelar la venta." });
      return;
    }
    await cancelarVenta(id, motivo);
    showAlert("Venta Cancelada", "success", { description: "La venta ha sido cancelada exitosamente." });
    fetchVentas();
  };

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Ventas" subtitle="Error al cargar datos" icon={<IconReceipt size={24} />} />
        <Card className="border-danger-100 bg-danger-50/30">
          <Card.Content className="py-8 text-center">
            <p className="text-danger-600 mb-6 font-medium">{error}</p>
            <Button onClick={() => fetchVentas()} variant="danger">Reintentar</Button>
          </Card.Content>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Ventas"
        subtitle="Gestiona las ventas realizadas a clientes"
        icon={<IconReceipt size={24} />}
        actions={
          <Button
            onClick={() => navigate("../ventas/crear", { relative: "route" })}
            disabled={!isCajaAbierta}
            className="w-full sm:w-auto shadow-lg shadow-primary-100"
          >
            <IconPlus size={18} />
            <span className="ml-2">Nueva Venta</span>
          </Button>
        }
      />

      {/* Filtros */}
      <Card className="shadow-sm border-primary-100/50">
        <Card.Content className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
            <Input
              placeholder="Buscar por cliente, documento..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="pl-10 bg-primary-50/30 border-primary-100 focus:bg-white transition-all"
            />
          </div>

          <div className="sm:w-64 relative">
            <IconFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 z-10" size={18} />
            <select
              value={filtroEstado}
              onChange={(e) => handleFiltroEstado(e.target.value as EstadoVenta | "")}
              className="w-full pl-10 pr-4 py-2.5 border border-primary-300 rounded-button text-sm bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all appearance-none"
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

      {/* Tabla */}
      <Card className="shadow-sm border-primary-100 overflow-hidden">
        <Card.Content className="p-0">
          {isLoading && ventas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4" />
              <p className="text-primary-600 font-medium">Cargando ventas...</p>
            </div>
          ) : ventas.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-300">
                <IconReceipt size={32} />
              </div>
              <h3 className="text-lg font-bold text-primary-900 mb-1">Sin ventas</h3>
              <p className="text-primary-600/60 mb-6 max-w-xs mx-auto text-sm">No se encontraron ventas registradas en el sistema.</p>
              <Button
                onClick={() => navigate("../ventas/crear", { relative: "route" })}
                disabled={!isCajaAbierta}
                size="sm"
              >
                Registrar primera venta
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head className="w-[100px]">ID</Table.Head>
                    <Table.Head>Cliente</Table.Head>
                    <Table.Head className="hidden md:table-cell">Fecha</Table.Head>
                    <Table.Head className="text-right">Total</Table.Head>
                    <Table.Head className="hidden sm:table-cell text-right text-orange-600">Saldo</Table.Head>
                    <Table.Head className="text-center">Estado</Table.Head>
                    <Table.Head className="text-center w-[80px]">Acciones</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {ventas.map((venta) => (
                    <Table.Row key={venta.id} className="group hover:bg-primary-50/30 transition-colors">
                      <Table.Cell className="font-mono text-xs text-primary-500">
                        {venta.numero_documento || `#${venta.id}`}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary-900">{venta.cliente_nombre}</span>
                          <span className="text-xs text-primary-400 font-medium md:hidden">
                            {formatDate(venta.fecha)}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="hidden md:table-cell text-sm text-primary-600">
                        {formatDate(venta.fecha)}
                      </Table.Cell>
                      <Table.Cell className="text-right font-black text-primary-900">
                        {formatCurrency(venta.total)}
                      </Table.Cell>
                      <Table.Cell className="hidden sm:table-cell text-right font-bold text-orange-600">
                        {formatCurrency(venta.saldo_pendiente)}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <Badge variant={estadoVariantMap[venta.estado]} className="text-xs uppercase font-bold tracking-tighter">
                          {venta.estado}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="px-2 h-8"
                            onClick={() => navigate(`../ventas/${venta.id}/detalle`, { relative: "route" })}
                          >
                            Ver
                          </Button>
                          {venta.estado !== "CANCELADA" && (
                            <Button
                              size="sm"
                              variant="danger"
                              className="px-2 h-8 hidden sm:flex"
                              disabled={loadingCancelar}
                              onClick={() => handleCancelar(venta.id)}
                            >
                              Anular
                            </Button>
                          )}
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
    </PageContainer>
  );
}
