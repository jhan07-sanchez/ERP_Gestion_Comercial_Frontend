import { useEffect, useState } from "react";
import { Card, Input, PageContainer, PageHeader, Table } from "@/shared/components/ui";
import { usePagosFactura } from "../hooks/usePagosFactura";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { IconCash, IconSearch } from "@tabler/icons-react";
import { useDebounceValue } from "@/shared/hooks";

export default function PagosList() {
  const { pagos, isLoading, error, fetchPagos, applyFilters } = usePagosFactura();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  useEffect(() => {
    fetchPagos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const normalizedSearch = debouncedSearchTerm.trim();
    applyFilters({
      ...(normalizedSearch ? { search: normalizedSearch } : {}),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Historial de Pagos" subtitle="Error al cargar datos" icon={<IconCash size={24} />} />
        <Card className="border-danger-100 bg-danger-50/30">
          <Card.Content className="py-8 text-center text-danger-600 font-medium">
            {error}
          </Card.Content>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Historial de Pagos"
        subtitle="Registro histórico de todos los pagos y recaudos recibidos"
        icon={<IconCash size={24} />}
      />

      <Card className="shadow-sm border-primary-100/50 mb-4">
        <Card.Content className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
            <Input
              placeholder="Buscar por número de factura, cliente o referencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card.Content>
      </Card>

      <Card className="shadow-sm border-primary-100 overflow-hidden">
        <Card.Content className="p-0">
          {isLoading && pagos.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-primary-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3" />
              Cargando pagos...
            </div>
          ) : pagos.length === 0 ? (
            <div className="text-center py-16 px-4 text-primary-400">
              <IconCash size={48} className="mx-auto mb-4 opacity-50" />
              <p>No se encontraron pagos registrados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Fecha</Table.Head>
                    <Table.Head>Factura (ID)</Table.Head>
                    <Table.Head>Método</Table.Head>
                    <Table.Head>Referencia</Table.Head>
                    <Table.Head className="text-right">Monto</Table.Head>
                    <Table.Head>Registrado por</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {pagos.map((pago) => (
                    <Table.Row key={pago.id} className="hover:bg-primary-50/30">
                      <Table.Cell className="text-sm">
                        {formatDate(pago.fecha, true)}
                      </Table.Cell>
                      <Table.Cell className="font-medium text-primary-800">
                        Factura #{pago.factura}
                      </Table.Cell>
                      <Table.Cell>
                        {pago.metodo_pago_nombre}
                      </Table.Cell>
                      <Table.Cell className="text-sm text-gray-500">
                        {pago.referencia || "-"}
                      </Table.Cell>
                      <Table.Cell className="text-right font-bold text-success-600">
                        {formatCurrency(pago.monto)}
                      </Table.Cell>
                      <Table.Cell className="text-sm text-gray-600">
                        {pago.registrado_por_nombre}
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
