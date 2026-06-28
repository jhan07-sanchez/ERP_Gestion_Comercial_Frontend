import { useEffect, useState } from "react";
import { Card, Input, PageContainer, PageHeader, Table, Badge } from "@/shared/components/ui";
import { impuestosAPI, type Impuesto } from "../api/impuestos.api";
import { IconPercentage, IconSearch } from "@tabler/icons-react";
import { useDebounceValue } from "@/shared/hooks";

interface ImpuestosListProps {
  title?: string;
  subtitle?: string;
  filtroNombre?: string;
}

export default function ImpuestosList({ 
  title = "Impuestos", 
  subtitle = "Gestión de impuestos y retenciones", 
  filtroNombre 
}: ImpuestosListProps) {
  const [impuestos, setImpuestos] = useState<Impuesto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  const fetchImpuestos = async (search?: string) => {
    setIsLoading(true);
    try {
      // Si hay un filtro por nombre de la ruta, lo usamos. Si el usuario escribe algo, lo agregamos a la búsqueda.
      const querySearch = search || filtroNombre || "";
      const data = await impuestosAPI.getImpuestos({ search: querySearch });
      setImpuestos(data.results || (data as unknown as Impuesto[]));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al cargar impuestos");
      } else {
        setError("Error al cargar impuestos");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImpuestos(debouncedSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filtroNombre]);

  return (
    <PageContainer>
      <PageHeader title={title} subtitle={subtitle} icon={<IconPercentage size={24} />} />

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
              placeholder="Buscar impuesto por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card.Content>
      </Card>

      <Card className="shadow-sm border-primary-100 overflow-hidden">
        <Card.Content className="p-0">
          {isLoading && impuestos.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-primary-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3" />
              Cargando impuestos...
            </div>
          ) : impuestos.length === 0 ? (
            <div className="text-center py-16 px-4 text-primary-400">
              <IconPercentage size={48} className="mx-auto mb-4 opacity-50" />
              <p>No se encontraron impuestos configurados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Nombre</Table.Head>
                    <Table.Head>Porcentaje (%)</Table.Head>
                    <Table.Head className="text-center">Estado</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {impuestos.map((imp) => (
                    <Table.Row key={imp.id} className="hover:bg-primary-50/30">
                      <Table.Cell className="font-bold text-primary-900">{imp.nombre}</Table.Cell>
                      <Table.Cell>{imp.porcentaje}%</Table.Cell>
                      <Table.Cell className="text-center">
                        <Badge variant={imp.activo ? "success" : "gray"}>
                          {imp.activo ? "Activo" : "Inactivo"}
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
