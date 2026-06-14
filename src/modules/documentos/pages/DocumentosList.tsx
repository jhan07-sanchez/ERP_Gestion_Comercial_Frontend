/**
 * 📄 PÁGINA: LISTADO CENTRALIZADO DE DOCUMENTOS
 */

import React, { useState, useEffect } from 'react';
import { 
  PageContainer, 
  PageHeader, 
  Table, 
  Badge, 
  Button, 
  Card,
  Input,
  Select 
} from '@/shared/components/ui';
import { 
  IconFileText, 
  IconDownload, 
  IconSearch, 
  IconFilter,
  IconEye
} from '@tabler/icons-react';
import { useDocumentos } from '../hooks/useDocumentos';
import { TIPO_DOCUMENTO, ESTADO_DOCUMENTO } from '../types/documentos.types';
import type { TipoDocumento, DocumentoList } from '../types/documentos.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDebounceValue } from '@/shared/hooks';

const DocumentosList: React.FC = () => {
  const { 
    documentos, 
    loading, 
    filters, 
    applyFilters, 
    handleDownloadPDF 
  } = useDocumentos();

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  useEffect(() => {
    applyFilters({ ...filters, search: debouncedSearchTerm });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  // Función para obtener variantes de Badge por tipo
  const getTipoVariant = (tipo: string) => {
    if (tipo === TIPO_DOCUMENTO.FACTURA_VENTA) return 'info';
    if (tipo === TIPO_DOCUMENTO.FACTURA_COMPRA) return 'warning';
    if (tipo === TIPO_DOCUMENTO.TICKET_POS) return 'info';
    return 'gray';
  };

  return (
    <PageContainer>
      <PageHeader
        title="Gestión de Documentos"
        subtitle="Listado centralizado de facturas, recibos y órdenes de compra."
        icon={<IconFileText className="text-accent-600" />}
      />

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <Input
              label="Buscar documento"
              placeholder="Número, cliente o UUID..."
              leftIcon={<IconSearch size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Select
              label="Tipo de Documento"
              value={filters.tipo}
              onChange={(val) => applyFilters({ ...filters, tipo: val as TipoDocumento })}
              options={[
                { label: 'Todos los tipos', value: '' },
                { label: 'Factura de Venta', value: TIPO_DOCUMENTO.FACTURA_VENTA },
                { label: 'Factura de Compra', value: TIPO_DOCUMENTO.FACTURA_COMPRA },
                { label: 'Ticket POS', value: TIPO_DOCUMENTO.TICKET_POS },
              ]}
            />
          </div>

          <div className="flex justify-end">
             <Button 
               variant="secondary" 
               onClick={() => {
                 setSearchTerm("");
                 applyFilters({ tipo: '', search: '' });
               }}
               className="w-full md:w-auto"
               leftIcon={<IconFilter size={18} />}
             >
               Limpiar Filtros
             </Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Número</Table.Head>
              <Table.Head>Tipo</Table.Head>
              <Table.Head>Entidad (Cliente/Prov)</Table.Head>
              <Table.Head>Emisión</Table.Head>
              <Table.Head>Total</Table.Head>
              <Table.Head>Estado</Table.Head>
              <Table.Head className="text-right">Acciones</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {loading ? (
              <Table.Row hover={false}>
                <Table.Cell className="text-center py-10" colSpan={7}>
                  Cargando documentos...
                </Table.Cell>
              </Table.Row>
            ) : documentos.length === 0 ? (
              <Table.Row hover={false}>
                <Table.Cell className="text-center py-10" colSpan={7}>
                  No se encontraron documentos emitidos.
                </Table.Cell>
              </Table.Row>
            ) : (
              documentos.map((doc: DocumentoList) => (
                <Table.Row key={doc.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-bold text-primary-900">{doc.numero_interno}</span>
                      <span className="text-xs text-primary-500 font-mono">
                        {doc.uuid.split('-')[0]}...
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={getTipoVariant(doc.tipo)}>
                      {doc.tipo_display}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-primary-800">{doc.entidad_nombre}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-primary-600">
                      {format(new Date(doc.fecha_emision), 'dd MMM yyyy, HH:mm', { locale: es })}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-bold text-primary-900">
                      ${new Intl.NumberFormat('es-CO').format(doc.total)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={doc.estado === ESTADO_DOCUMENTO.ANULADO ? 'danger' : 'success'}>
                      {doc.estado_display}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownloadPDF(doc.id, doc.numero_interno)}
                        title="Descargar PDF"
                        iconOnly
                      >
                        <IconDownload size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/api/documentos/${doc.id}/pdf/`, '_blank')}
                        title="Ver en nueva pestaña"
                        iconOnly
                      >
                        <IconEye size={16} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Card>
    </PageContainer>
  );
};

export default DocumentosList;
