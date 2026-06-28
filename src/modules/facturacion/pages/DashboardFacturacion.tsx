import { useNavigate } from "react-router-dom";

import {
  Card,
  Button,
  Badge,
  Table,
  PageContainer,
  PageHeader,
} from "@/shared/components/ui";

import { Loader } from "@/shared/components/Loader";

import {
  IconCash,
  IconReceipt,
  IconFileInvoice,
  IconClock,
  IconUsers,
  IconInfoCircle,
} from "@tabler/icons-react";

import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { useDashboardFacturacion } from "../hooks/useDashboardFacturacion";
import { DashKPI } from "../components/dashboard/DashKPI";
import { ActionButton } from "../components/dashboard/ActionButton";


export default function DashboardFacturacionPage() {
  const navigate = useNavigate();

  const { resumen, cuentas, loading } = useDashboardFacturacion();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader />
      </div>
    );
  }

  const kpis = resumen?.kpis_mes_actual;

  const estados = resumen?.facturas_por_estado ?? {};

  const totalFacturas = Object.values(estados).reduce(
    (acc: number, value) => acc + Number(value),
    0,
  );

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard de Facturación"
        subtitle="Resumen general de ventas y cuentas por cobrar"
        icon={<IconFileInvoice size={24} />}
      />

      {/* KPI Cards */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashKPI
          label="Facturas"
          value={String(totalFacturas)}
          icon={<IconReceipt size={22} />}
          color="blue"
        />

        <DashKPI
          label="Facturado"
          value={formatCurrency(kpis?.total_facturado ?? 0)}
          icon={<IconFileInvoice size={22} />}
          color="emerald"
        />

        <DashKPI
          label="Cobrado"
          value={formatCurrency(kpis?.total_cobrado ?? 0)}
          icon={<IconCash size={22} />}
          color="indigo"
        />

        <DashKPI
          label="Pendiente"
          value={formatCurrency(kpis?.saldo_pendiente ?? 0)}
          icon={<IconClock size={22} />}
          color="rose"
          highlighted
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Acciones */}

        <Card className="xl:col-span-1 shadow-sm border-primary-100">
          <Card.Header>
            <Card.Title>Acciones Rápidas</Card.Title>
          </Card.Header>

          <Card.Content className="space-y-3">
            <ActionButton
              label="Nueva Factura de Venta"
              description="Registrar nueva venta"
              icon={<IconReceipt size={20} />}
              color="blue"
              onClick={() =>
                navigate("/facturacion/facturas_venta/nueva_factura")
              }
            />

            <ActionButton
              label="Nueva Factura de Compra"
              description="Registrar nueva Compra"
              icon={<IconReceipt size={20} />}
              color="blue"
              onClick={() =>
                navigate("/facturacion/facturas_compra/nueva_factura")
              }
            />

            <ActionButton
              label="Facturas Pendientes"
              description="Gestionar cobros"
              icon={<IconClock size={20} />}
              color="amber"
              onClick={() =>
                navigate("/facturacion/cuentas_cobrar/facturas_pendientes")
              }
            />

            <ActionButton
              label="Clientes"
              description="Administrar clientes"
              icon={<IconUsers size={20} />}
              color="indigo"
              onClick={() => navigate("/facturacion/clientes")}
            />

            <ActionButton
              label="Ver Facturas"
              description="Listado completo"
              icon={<IconInfoCircle size={20} />}
              color="rose"
              onClick={() => navigate("/facturacion/facturas")}
            />
          </Card.Content>
        </Card>

        {/* Tabla */}

        <Card className="xl:col-span-2 overflow-hidden shadow-sm border-primary-100">
          <Card.Header className="flex flex-row items-center justify-between">
            <Card.Title>Cuentas por Cobrar</Card.Title>

            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                navigate("/facturacion/cuentas_cobrar/facturas_pendientes")
              }
            >
              Ver todas
            </Button>
          </Card.Header>

          <Card.Content className="p-0">
            {cuentas.length === 0 ? (
              <div className="text-center py-12">Sin cuentas pendientes</div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Factura</Table.Head>
                    <Table.Head>Cliente</Table.Head>
                    <Table.Head>Estado</Table.Head>
                    <Table.Head className="text-right">Saldo</Table.Head>
                    <Table.Head>Vencimiento</Table.Head>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {cuentas.map((item) => (
                    <Table.Row key={item.factura_id}>
                      <Table.Cell>{item.numero}</Table.Cell>

                      <Table.Cell>{item.cliente_nombre}</Table.Cell>

                      <Table.Cell>
                        <Badge variant="warning">{item.estado}</Badge>
                      </Table.Cell>

                      <Table.Cell className="text-right font-bold text-danger-600">
                        {formatCurrency(item.saldo_pendiente)}
                      </Table.Cell>

                      <Table.Cell>
                        {formatDate(item.fecha_vencimiento)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </Card.Content>
        </Card>
      </div>
    </PageContainer>
  );
  
}
