import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, PageContainer, PageHeader, Table, Pagination } from "@/shared/components/ui";
import { useFacturasVenta } from "../hooks/useFacturasVenta";
import { useFacturaActions } from "../hooks/useFacturaActions";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import type { EstadoFactura, FacturaFilters } from "../types";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { IconReceipt, IconPlus, IconSearch, IconFilter } from "@tabler/icons-react";
import { useDebounceValue } from "@/shared/hooks";
import { FacturaStatusBadge } from "../components/FacturaStatusBadge";

interface FacturasVentaListProps {
  title?: string;
  subtitle?: string;
  defaultEstado?: EstadoFactura | "";
}

export default function FacturasVentaList({
  title = "Facturas de Venta",
  subtitle = "Gestiona las facturas formales emitidas a clientes",
  defaultEstado = "",
}: FacturasVentaListProps) {
  const navigate = useNavigate();
  const { facturas, isLoading, error, fetchFacturas, applyFilters, currentPage, totalCount, changePage } = useFacturasVenta();
  const { anularFactura, loadingAnular } = useFacturaActions();
  const { isCajaAbierta } = useCajaStore();
  const { showAlert, prompt } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);
  const [filtroEstado, setFiltroEstado] = useState<EstadoFactura | "">(defaultEstado);

  // Sync prop changes (e.g., when route changes)
  useEffect(() => {
    setFiltroEstado(defaultEstado);
  }, [defaultEstado]);

  useEffect(() => {
    fetchFacturas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFirstFilterRender = useRef(true);

  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }

    const normalizedSearch = debouncedSearchTerm.trim();
    const filters: FacturaFilters = {
      ...(normalizedSearch ? { search: normalizedSearch } : {}),
      ...(filtroEstado ? { estado: filtroEstado } : {}),
    };
    applyFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filtroEstado]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFiltroEstado = (estado: EstadoFactura | "") => {
    setFiltroEstado(estado);
  };

  const handleAnular = async (id: number) => {
    const motivo = await prompt("Anular Factura", "Por favor, ingresa el motivo de la anulación:", "");
    if (motivo === null) return;
    if (!motivo.trim()) {
      showAlert("Validación", "warning", { description: "Debes ingresar un motivo para anular la factura." });
      return;
    }
    const success = await anularFactura(id, { motivo });
    if (success) {
      showAlert("Factura Anulada", "success", { description: "La factura ha sido anulada exitosamente." });
      fetchFacturas();
    }
  };

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Facturas de Venta" subtitle="Error al cargar datos" icon={<IconReceipt size={24} />} />
        <Card className="border-danger-100 bg-danger-50/30">
          <Card.Content className="py-8 text-center">
            <p className="text-danger-600 mb-6 font-medium">{error}</p>
            <Button onClick={() => fetchFacturas()} variant="danger">Reintentar</Button>
          </Card.Content>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={<IconReceipt size={24} />}
        actions={
          <Button
            onClick={() => navigate("../facturas_venta/nueva_factura", { relative: "route" })}
            disabled={!isCajaAbierta}
            className="w-full sm:w-auto shadow-lg shadow-primary-100"
          >
            <IconPlus size={18} />
            <span className="ml-2">Nueva Factura</span>
          </Button>
        }
      />

      <Card className="shadow-sm border-primary-100/50">
        <Card.Content className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
            <Input
              placeholder="Buscar por cliente, número..."
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
              onChange={(e) => handleFiltroEstado(e.target.value as EstadoFactura | "")}
              className="w-full pl-10 pr-4 py-2.5 border border-primary-300 rounded-button text-sm bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all appearance-none"
            >
              <option value="">Todos los estados</option>
              <option value="BORRADOR">Borrador</option>
              <option value="EMITIDA">Emitida</option>
              <option value="PARCIAL">Parcial</option>
              <option value="PAGADA">Pagada</option>
              <option value="VENCIDA">Vencida</option>
              <option value="ANULADA">Anulada</option>
            </select>
          </div>
        </Card.Content>
      </Card>

      <Card className="shadow-sm border-primary-100 overflow-hidden">
        <Card.Content className="p-0">
          {isLoading && facturas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4" />
              <p className="text-primary-600 font-medium">Cargando facturas...</p>
            </div>
          ) : facturas.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-300">
                <IconReceipt size={32} />
              </div>
              <h3 className="text-lg font-bold text-primary-900 mb-1">Sin facturas</h3>
              <p className="text-primary-600/60 mb-6 max-w-xs mx-auto text-sm">No se encontraron facturas registradas en el sistema.</p>
              <Button
                onClick={() => navigate("../facturas_venta/nueva_factura", { relative: "route" })}
                disabled={!isCajaAbierta}
                size="sm"
              >
                Registrar primera factura
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head className="w-[100px]">Número</Table.Head>
                    <Table.Head>Cliente</Table.Head>
                    <Table.Head className="hidden md:table-cell">Emisión</Table.Head>
                    <Table.Head className="hidden md:table-cell">Vencimiento</Table.Head>
                    <Table.Head className="text-right">Total</Table.Head>
                    <Table.Head className="hidden sm:table-cell text-right text-orange-600">Saldo</Table.Head>
                    <Table.Head className="text-center">Estado</Table.Head>
                    <Table.Head className="text-center w-[80px]">Acciones</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {facturas.map((factura) => (
                    <Table.Row key={factura.id} className="group hover:bg-primary-50/30 transition-colors">
                      <Table.Cell className="font-mono text-xs text-primary-500">
                        {factura.numero || `#Borrador-${factura.id}`}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary-900">{factura.cliente_nombre}</span>
                          <span className="text-xs text-primary-400 font-medium md:hidden">
                            {factura.fecha_emision ? formatDate(factura.fecha_emision) : '-'}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="hidden md:table-cell text-sm text-primary-600">
                        {factura.fecha_emision ? formatDate(factura.fecha_emision) : '-'}
                      </Table.Cell>
                      <Table.Cell className="hidden md:table-cell text-sm text-primary-600">
                        {factura.fecha_vencimiento ? formatDate(factura.fecha_vencimiento) : '-'}
                      </Table.Cell>
                      <Table.Cell className="text-right font-black text-primary-900">
                        {formatCurrency(factura.total)}
                      </Table.Cell>
                      <Table.Cell className="hidden sm:table-cell text-right font-bold text-orange-600">
                        {formatCurrency(factura.saldo_pendiente)}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <FacturaStatusBadge estado={factura.estado} />
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="px-2 h-8"
                            onClick={() => navigate(`/facturacion/facturas_venta/${factura.id}/detalle`, { relative: "route" })}
                          >
                            Ver
                          </Button>
                          {factura.estado !== "ANULADA" && (
                            <Button
                              size="sm"
                              variant="danger"
                              className="px-2 h-8 hidden sm:flex"
                              disabled={loadingAnular}
                              onClick={() => handleAnular(factura.id)}
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
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalCount / 10)}
                pageSize={10}
                totalCount={totalCount}
                onPageChange={(page) => changePage(page)}
                onPageSizeChange={() => {}}
              />
            </div>
          )}
        </Card.Content>
      </Card>
    </PageContainer>
  );
}
