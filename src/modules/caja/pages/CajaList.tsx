import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Table, Badge, PageContainer, PageHeader } from "@/shared/components/ui";
import { useCaja } from "../hooks/Usecaja";
import { formatDate } from "../../../shared/utils/formatters";
import { IconCash } from "@tabler/icons-react";

export default function CajaList() {
  const navigate = useNavigate();
  const { cajas, isLoading, error, fetchCajas, applyFilters } = useCaja();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCajas();
  }, [fetchCajas]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filters = value ? { search: value } : {};
    applyFilters(filters);
  };

  if (isLoading && cajas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-primary-600 font-medium">Cargando cajas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Cajas"
          subtitle="Hubo un problema al cargar los datos"
          actions={
            <Button onClick={() => fetchCajas()}>Reintentar</Button>
          }
        />
        <Card>
          <Card.Content>
            <p className="text-danger-600 font-medium">{error}</p>
          </Card.Content>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Gestión de Cajas"
        subtitle="Administra y supervisa el flujo de efectivo"
        icon={<IconCash size={24} />}
        actions={
          <Button
            onClick={() => navigate("/caja/crear")}
            className="w-full sm:w-auto shadow-md shadow-blue-200"
          >
            Nueva Caja
          </Button>
        }
      />

      {/* Busqueda */}
      <Card className="shadow-sm border-primary-100">
        <Card.Content className="p-4">
          <div className="max-w-md">
            <Input
              placeholder="Buscar por nombre de caja..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-primary-50/50"
            />
          </div>
        </Card.Content>
      </Card>

      {/* Tabla */}
      <Card className="overflow-hidden border-primary-100 shadow-sm">
        <Card.Content className="p-0">
          {cajas.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconCash size={32} className="text-primary-300" />
              </div>
              <p className="text-primary-500 font-medium">No hay cajas registradas</p>
              <Button
                variant="secondary"
                className="mt-6"
                onClick={() => navigate("/caja/crear")}
              >
                Crear primera caja
              </Button>
            </div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Caja</Table.Head>
                  <Table.Head className="hidden md:table-cell">Descripción</Table.Head>
                  <Table.Head className="text-center">Estado</Table.Head>
                  <Table.Head className="hidden lg:table-cell">Última apertura</Table.Head>
                  <Table.Head className="text-center">Acciones</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cajas.map((caja) => (
                  <Table.Row key={caja.id} hover>
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="font-bold text-primary-900">{caja.nombre}</span>
                        <span className="md:hidden text-xs text-primary-500 truncate max-w-[150px]">
                          {caja.descripcion || "Sin descripción"}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="hidden md:table-cell text-primary-600">
                      {caja.descripcion || "—"}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <Badge variant={caja.esta_abierta ? "success" : "gray"}>
                        {caja.esta_abierta ? "Abierta" : "Cerrada"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="hidden lg:table-cell text-primary-500">
                      {caja.fecha_creacion ? formatDate(caja.fecha_creacion) : "—"}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {caja.esta_abierta ? (
                          caja.sesion_activa_id ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
                              onClick={() => navigate(`/caja/sesion/${caja.sesion_activa_id}`)}
                            >
                              Ver Sesión
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                              onClick={() => navigate(`/caja/dashboard`)}
                            >
                              Gestionar
                            </Button>
                          )
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => navigate(`/caja/abrir/${caja.id}`)}
                          >
                            Abrir
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Card.Content>
      </Card>
    </PageContainer>
  );
}