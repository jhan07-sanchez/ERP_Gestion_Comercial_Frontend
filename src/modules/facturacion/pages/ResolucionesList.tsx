import { useEffect, useState } from "react";
import { Card, Input, PageContainer, PageHeader, Table, Badge } from "@/shared/components/ui";
import { resolucionesAPI, type ResolucionFacturacion } from "../api/resoluciones.api";
import { formatDate } from "@/shared/utils/formatters";
import { IconShieldCheck, IconSearch, IconFileCertificate } from "@tabler/icons-react";
import { useDebounceValue } from "@/shared/hooks";

interface ResolucionesListProps {
  title?: string;
  subtitle?: string;
  filtroActiva?: boolean;
}

export default function ResolucionesList({ 
  title = "Resoluciones", 
  subtitle = "Gestión de resoluciones de facturación", 
  filtroActiva 
}: ResolucionesListProps) {
  const [resoluciones, setResoluciones] = useState<ResolucionFacturacion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  const fetchResoluciones = async (search?: string) => {
    setIsLoading(true);
    try {
      const data = await resolucionesAPI.getResoluciones({ 
        search, 
        ...(filtroActiva !== undefined ? { activa: filtroActiva } : {}) 
      });
      setResoluciones(data.results || (data as unknown as ResolucionFacturacion[]));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al cargar resoluciones");
      } else {
        setError("Error al cargar resoluciones");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResoluciones(debouncedSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filtroActiva]);

  return (
    <PageContainer>
      <PageHeader title={title} subtitle={subtitle} icon={<IconFileCertificate size={24} />} />

      {error && (
        <Card className="border-danger-100 bg-danger-50/30 mb-4">
          <Card.Content className="py-4 text-center text-danger-600 font-medium">
            {error}
          </Card.Content>
        </Card>
      )}

      <Card className="shadow-sm border-primary-100/50 mb-4">
        <Card.Content className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
            <Input
              placeholder="Buscar por número o prefijo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card.Content>
      </Card>

      <Card className="shadow-sm border-primary-100 overflow-hidden">
        <Card.Content className="p-0">
          {isLoading && resoluciones.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-primary-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3" />
              Cargando resoluciones...
            </div>
          ) : resoluciones.length === 0 ? (
            <div className="text-center py-16 px-4 text-primary-400">
              <IconShieldCheck size={48} className="mx-auto mb-4 opacity-50" />
              <p>No se encontraron resoluciones.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Número</Table.Head>
                    <Table.Head>Prefijo</Table.Head>
                    <Table.Head>Rango</Table.Head>
                    <Table.Head>Vigencia</Table.Head>
                    <Table.Head className="text-center">Estado</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {resoluciones.map((res) => (
                    <Table.Row key={res.id} className="hover:bg-primary-50/30">
                      <Table.Cell className="font-bold text-primary-900">{res.numero_resolucion}</Table.Cell>
                      <Table.Cell>{res.prefijo || "N/A"}</Table.Cell>
                      <Table.Cell>
                        {res.rango_inicial} - {res.rango_final} <br/>
                        <span className="text-xs text-primary-400">Actual: {res.consecutivo_actual}</span>
                      </Table.Cell>
                      <Table.Cell>
                        {formatDate(res.fecha_inicio)} al {formatDate(res.fecha_fin)}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <Badge variant={res.activa ? "success" : "danger"}>
                          {res.activa ? "Vigente" : "Vencida/Inactiva"}
                        </Badge>
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
