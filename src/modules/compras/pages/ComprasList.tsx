import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Table, Badge, PageContainer, PageHeader } from "@/shared/components/ui";
import { useCompras } from "../hooks/useCompras";
import type { CompraFilters, EstadoCompra } from "../types";
import { formatCurrency, truncateProductos, formatDate } from "@/shared/utils/formatters";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { IconShoppingCart, IconPlus, IconSearch, IconX, IconEye } from "@tabler/icons-react";

const estadoVariantMap: Record<EstadoCompra, "success" | "warning" | "danger" | "gray"> = {
  COMPLETADA: "success",
  PARCIAL: "warning",
  PENDIENTE: "gray",
  ANULADA: "danger",
};

export default function ComprasList() {
  const navigate = useNavigate();
  const {
    compras,
    isLoading,
    error,
    fetchCompras,
    applyFilters,
    anularCompra,
    loadingAnular,
  } = useCompras();
  const { isCajaAbierta } = useCajaStore();
  const { showAlert, prompt: alertPrompt } = useAlert();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filters: CompraFilters = value ? { search: value } : {};
    applyFilters(filters);
  };



  const handleAnular = async (id: number) => {
    const motivo = await alertPrompt("Anular Compra", "Por favor, ingresa el motivo de la anulación:", "");
    if (motivo === null) return;
    if (!motivo.trim()) {
      showAlert("Validación", "warning", { description: "Debes ingresar un motivo para anular la compra." });
      return;
    }
    await anularCompra(id, motivo);
    showAlert("Compra Anulada", "info");
  };

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Compras" subtitle="Error al cargar datos" />
        <Card className="border-danger-100 bg-danger-50/30">
          <Card.Content className="py-8 text-center">
            <p className="text-danger-600 mb-6 font-medium">{error}</p>
            <Button onClick={() => fetchCompras()} variant="danger">Reintentar</Button>
          </Card.Content>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Compras"
        subtitle="Gestiona las compras realizadas a proveedores"
        icon={<IconShoppingCart size={24} />}
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
        <Card.Content className="p-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
            <Input
              placeholder="Buscar por proveedor, fecha o número..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-primary-50/30 border-primary-100 focus:bg-white transition-all"
            />
          </div>
        </Card.Content>
      </Card>

      <Card className="shadow-sm border-primary-100 overflow-hidden">
        <Card.Content className="p-0">
          {isLoading && compras.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4" />
              <p className="text-primary-600 font-medium">Cargando compras...</p>
            </div>
          ) : compras.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-300">
                <IconShoppingCart size={32} />
              </div>
              <h3 className="text-lg font-bold text-primary-900 mb-1">Sin compras</h3>
              <p className="text-primary-600/60 mb-6 max-w-xs mx-auto text-sm">No se encontraron compras registradas en el sistema.</p>
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
                  {compras.map((compra) => (
                    <Table.Row key={compra.id} className="group hover:bg-primary-50/30 transition-colors">
                      <Table.Cell className="font-mono text-xs text-primary-500">
                        {compra.numero_compra || "----"}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary-900">{compra.proveedor_info?.nombre || "----"}</span>
                          <span className="text-[10px] text-primary-400 font-medium lg:hidden">
                            {formatDate(compra.fecha)}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="hidden lg:table-cell text-sm text-primary-600">
                        {formatDate(compra.fecha)}
                      </Table.Cell>
                      <Table.Cell className="hidden md:table-cell text-xs text-primary-500 italic max-w-[200px] truncate">
                        {compra.productos_resumen ? truncateProductos(compra.productos_resumen) : "----"}
                      </Table.Cell>
                      <Table.Cell className="text-right font-black text-primary-900">
                        {formatCurrency(compra.total)}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <Badge variant={estadoVariantMap[compra.estado]} className="text-[10px] uppercase font-bold tracking-tighter">
                          {compra.estado}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            iconOnly
                            className="hover:bg-white shadow-sm border-transparent hover:border-primary-100"
                            onClick={() => navigate(`../compras/${compra.id}/detalles`)}
                            title="Ver detalle"
                          >
                            <IconEye size={16} className="text-primary-600" />
                          </Button>

                          {compra.estado === "PENDIENTE" && (
                            <>
                              <Button
                                variant="secondary"
                                size="sm"
                                iconOnly
                                className="hover:bg-danger-50 shadow-sm border-transparent hover:border-danger-100"
                                onClick={() => handleAnular(compra.id)}
                                disabled={loadingAnular}
                                title="Anular compra"
                              >
                                <IconX size={16} className="text-danger-600" />
                              </Button>
                            </>
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

