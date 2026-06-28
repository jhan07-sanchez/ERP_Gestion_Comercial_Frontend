import { useEffect, useState } from "react";
import { Card, Input, PageContainer, PageHeader, Table } from "@/shared/components/ui";
import { notasCreditoAPI, notasDebitoAPI, type NotaBase } from "../api/notas.api";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { IconFileInvoice, IconSearch } from "@tabler/icons-react";
import { useDebounceValue } from "@/shared/hooks";
import { FacturaStatusBadge } from "../components/FacturaStatusBadge";

interface NotasListProps {
  tipo?: "CREDITO" | "DEBITO";
  title?: string;
  subtitle?: string;
  defaultEstado?: string;
}

export default function NotasList({ 
  tipo = "CREDITO", 
  title = "Notas", 
  subtitle = "Gestión de notas", 
  defaultEstado = "" 
}: NotasListProps) {
  const [notas, setNotas] = useState<NotaBase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);
  const [filtroEstado, setFiltroEstado] = useState(defaultEstado);

  useEffect(() => {
    setFiltroEstado(defaultEstado);
  }, [defaultEstado]);

  const fetchNotas = async (search?: string, estado?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const api = tipo === "CREDITO" ? notasCreditoAPI : notasDebitoAPI;
      const data = await api.getNotas({ search, estado });
      setNotas(data.results || (data as unknown as NotaBase[]));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al cargar las notas");
      } else {
        setError("Error al cargar las notas");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas(debouncedSearchTerm, filtroEstado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filtroEstado, tipo]);

  if (error) {
    return (
      <PageContainer>
        <PageHeader title={title} subtitle="Error al cargar datos" icon={<IconFileInvoice size={24} />} />
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
      <PageHeader title={title} subtitle={subtitle} icon={<IconFileInvoice size={24} />} />

      <Card className="shadow-sm border-primary-100/50 mb-4">
        <Card.Content className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
            <Input
              placeholder={`Buscar Nota de ${tipo === "CREDITO" ? "Crédito" : "Débito"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card.Content>
      </Card>

      <Card className="shadow-sm border-primary-100 overflow-hidden">
        <Card.Content className="p-0">
          {isLoading && notas.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-primary-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3" />
              Cargando notas...
            </div>
          ) : notas.length === 0 ? (
            <div className="text-center py-16 px-4 text-primary-400">
              <IconFileInvoice size={48} className="mx-auto mb-4 opacity-50" />
              <p>No se encontraron notas registradas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Fecha</Table.Head>
                    <Table.Head>Número</Table.Head>
                    <Table.Head>Factura (ID)</Table.Head>
                    <Table.Head>Motivo</Table.Head>
                    <Table.Head className="text-right">Total</Table.Head>
                    <Table.Head className="text-center">Estado</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {notas.map((nota) => (
                    <Table.Row key={nota.id} className="hover:bg-primary-50/30">
                      <Table.Cell className="text-sm">
                        {formatDate(nota.fecha_emision)}
                      </Table.Cell>
                      <Table.Cell className="font-medium text-primary-800">
                        {nota.numero || `#Borrador-${nota.id}`}
                      </Table.Cell>
                      <Table.Cell>
                        Factura #{nota.factura}
                      </Table.Cell>
                      <Table.Cell className="text-sm text-gray-500">
                        {nota.motivo || "-"}
                      </Table.Cell>
                      <Table.Cell className="text-right font-bold text-primary-900">
                        {formatCurrency(nota.total)}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <FacturaStatusBadge estado={nota.estado} />
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
