import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, PageContainer, PageHeader, Table, Badge } from "@/shared/components/ui";
import { useFacturasCompra } from "../hooks/useFacturasCompra";
import { formatCurrency, truncateProductos, formatDate } from "@/shared/utils/formatters";
import type { FacturaCompraFilters } from "../types/facturaCompra.types";
import type { EstadoCompra } from "@/modules/compras/types";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { facturasCompraAPI } from "../api/facturas-compra.api";
import { IconFileInvoice, IconPlus, IconSearch, IconFilter, IconEye, IconX } from "@tabler/icons-react";
import { useDebounceValue } from "@/shared/hooks";

const estadoVariantMap: Record<EstadoCompra, "success" | "warning" | "danger" | "gray"> = {
  COMPLETADA: "success",
  PARCIAL: "warning",
  PENDIENTE: "gray",
  ANULADA: "danger",
};

interface FacturasCompraListProps {
  title?: string;
  subtitle?: string;
  defaultEstado?: EstadoCompra | "";
}

export default function FacturasCompraList({
  title = "Facturas de Compra",
  subtitle = "Gestiona las facturas de compra emitidas por proveedores",
  defaultEstado = "",
}: FacturasCompraListProps) {
  const navigate = useNavigate();
  const { facturas, isLoading, error, fetchFacturas, applyFilters } = useFacturasCompra();
  const { isCajaAbierta } = useCajaStore();
  const { showAlert, prompt: alertPrompt } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);
  const [filtroEstado, setFiltroEstado] = useState<EstadoCompra | "">(defaultEstado);
  const [loadingAnular, setLoadingAnular] = useState(false);

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
    const filters: FacturaCompraFilters = {
      ...(normalizedSearch ? { search: normalizedSearch } : {}),
      ...(filtroEstado ? { estado: filtroEstado } : {}),
    };
    applyFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filtroEstado]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFiltroEstado = (estado: EstadoCompra | "") => {
    setFiltroEstado(estado);
  };

  const handleAnular = async (id: number) => {
    const motivo = await alertPrompt("Anular Factura de Compra", "Por favor, ingresa el motivo de la anulación:", "");
    if (motivo === null) return;
    if (!motivo.trim()) {
      showAlert("Validación", "warning", { description: "Debes ingresar un motivo para anular la factura." });
      return;
    }
    setLoadingAnular(true);
    try {
      await facturasCompraAPI.anularFacturaCompra(id, motivo);
      showAlert("Factura Anulada", "success", { description: "La factura de compra ha sido anulada exitosamente." });
      fetchFacturas();
    } catch {
      showAlert("Error", "danger", { description: "No se pudo anular la factura." });
    } finally {
      setLoadingAnular(false);
    }
  };

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Facturas de Compra" subtitle="Error al cargar datos" icon={<IconFileInvoice size={24} />} />
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
        icon={<IconFileInvoice size={24} />}
        actions={
          <Button
            onClick={() => navigate("../compras/crear", { relative: "route" })}
            disabled={!isCajaAbierta}
            className="w-full sm:w-auto shadow-lg shadow-primary-100"
          >
            <IconPlus size={18} />
            <span className="ml-2">Nueva Compra</span>
          </Button>
        }
      />

      <Card className="shadow-sm border-primary-100/50">
        <Card.Content className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
            <Input
              placeholder="Buscar por proveedor, número..."
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
              onChange={(e) => handleFiltroEstado(e.target.value as EstadoCompra | "")}
              className="w-full pl-10 pr-4 py-2.5 border border-primary-300 rounded-button text-sm bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all appearance-none"
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="COMPLETADA">Completada</option>
              <option value="PARCIAL">Parcial</option>
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
              <p className="text-primary-600 font-medium">Cargando facturas de compra...</p>
            </div>
          ) : facturas.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-300">
                <IconFileInvoice size={32} />
              </div>
              <h3 className="text-lg font-bold text-primary-900 mb-1">Sin facturas de compra</h3>
              <p className="text-primary-600/60 mb-6 max-w-xs mx-auto text-sm">No se encontraron facturas de compra registradas en el sistema.</p>
              <Button
                onClick={() => navigate("../compras/crear", { relative: "route" })}
                disabled={!isCajaAbierta}
                size="sm"
              >
                Registrar primera compra
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head className="w-[100px]">Nº</Table.Head>
                    <Table.Head>Proveedor</Table.Head>
                    <Table.Head className="hidden lg:table-cell">Fecha</Table.Head>
                    <Table.Head className="hidden md:table-cell">Productos</Table.Head>
                    <Table.Head className="text-right">Total</Table.Head>
                    <Table.Head className="text-center">Estado</Table.Head>
                    <Table.Head className="text-center w-[80px]">Acciones</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {facturas.map((factura) => (
                    <Table.Row key={factura.id} className="group hover:bg-primary-50/30 transition-colors">
                      <Table.Cell className="font-mono text-xs text-primary-500">
                        {factura.numero_compra || "----"}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary-900">{factura.proveedor_info?.nombre || "----"}</span>
                          <span className="text-xs text-primary-400 font-medium lg:hidden">
                            {formatDate(factura.fecha)}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="hidden lg:table-cell text-sm text-primary-600">
                        {formatDate(factura.fecha)}
                      </Table.Cell>
                      <Table.Cell className="hidden md:table-cell text-xs text-primary-500 italic max-w-52 truncate">
                        {factura.productos_resumen ? truncateProductos(factura.productos_resumen) : "----"}
                      </Table.Cell>
                      <Table.Cell className="text-right font-black text-primary-900">
                        {formatCurrency(factura.total)}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <Badge variant={estadoVariantMap[factura.estado]} className="text-xs uppercase font-bold tracking-tighter">
                          {factura.estado}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            iconOnly
                            className="hover:bg-white shadow-sm border-transparent hover:border-primary-100"
                            onClick={() => navigate(`../compras/${factura.id}/detalles`)}
                            title="Ver detalle"
                          >
                            <IconEye size={16} className="text-primary-600" />
                          </Button>

                          {factura.estado === "PENDIENTE" && (
                            <Button
                              variant="secondary"
                              size="sm"
                              iconOnly
                              className="hover:bg-danger-50 shadow-sm border-transparent hover:border-danger-100"
                              onClick={() => handleAnular(factura.id)}
                              disabled={loadingAnular}
                              title="Anular factura"
                            >
                              <IconX size={16} className="text-danger-600" />
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
