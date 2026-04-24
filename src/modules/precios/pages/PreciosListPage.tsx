// src/modules/precios/pages/PreciosList.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Input,
  Table,
  Badge,
  PageContainer,
  PageHeader,
} from "@/shared/components/ui";

import { usePreciosList, useDeletePrecio } from "../hooks/usePrecios";
import { formatCurrency } from "@/shared/utils/formatters";
import { useAlert } from "@/shared/components/alerts";

import {
  IconTag,
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlertCircle,
} from "@tabler/icons-react";

export default function PreciosList() {
  const navigate = useNavigate();
  const { showAlert, confirm } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const { data: preciosData, isLoading } = usePreciosList({ search: searchTerm });
  const deleteMutation = useDeletePrecio();

  const precios = preciosData?.results || [];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDelete = async (id: number) => {
    const confirmar = await confirm(
      "Eliminar Precio",
      "¿Seguro que deseas desactivar este precio?",
      "critical",
    );

    if (confirmar) {
      try {
        await deleteMutation.mutateAsync(id);
        showAlert("Precio desactivado exitosamente", "success");
      } catch (error) {
        console.error(error);
        showAlert("Error al desactivar el precio", "error");
      }
    }
  };

  if (isLoading && precios.length === 0) {
    return (
      <PageContainer>
        <PageHeader title="Precios" subtitle="Cargando precios..." />
        <Card>
          <Card.Content>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
            </div>
          </Card.Content>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Lista de Precios"
        subtitle="Gestiona precios de compra por proveedor"
        icon={<IconTag size={24} />}
        actions={
          <Button onClick={() => navigate("/precios/crear")}>
            <IconPlus size={18} className="mr-2" />
            Nuevo Precio
          </Button>
        }
      />

      {/* 🔍 BUSCADOR */}
      <Card>
        <Card.Content>
          <div className="relative">
            <Input
              placeholder="Buscar producto o proveedor..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </Card.Content>
      </Card>

      {/* 📊 TABLA */}
      <Card>
        <Card.Content>
          {precios.length === 0 ? (
            <div className="text-center py-10">
              <IconAlertCircle size={32} />
              <p>No hay precios registrados</p>
            </div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Producto</Table.Head>
                  <Table.Head>Proveedor</Table.Head>
                  <Table.Head className="text-right">Precio</Table.Head>
                  <Table.Head className="text-center">Estado</Table.Head>
                  <Table.Head>Inicio</Table.Head>
                  <Table.Head className="text-right">Acciones</Table.Head>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {precios.map((precio) => (
                  <Table.Row key={precio.id}>
                    <Table.Cell>{precio.producto_nombre}</Table.Cell>

                    <Table.Cell>{precio.proveedor_nombre}</Table.Cell>

                    <Table.Cell className="text-right font-bold">
                      {formatCurrency(precio.precio)}
                    </Table.Cell>

                    <Table.Cell className="text-center">
                      <Badge variant={precio.vigente ? "success" : "gray"}>
                        {precio.vigente ? "Vigente" : "Histórico"}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell>{precio.fecha_inicio}</Table.Cell>

                    <Table.Cell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`/precios/${precio.id}/editar`)
                          }
                        >
                          <IconEdit size={14} />
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(precio.id)}
                        >
                          <IconTrash size={14} />
                        </Button>
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
