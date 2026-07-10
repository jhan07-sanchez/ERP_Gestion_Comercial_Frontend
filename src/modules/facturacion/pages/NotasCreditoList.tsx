import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, PageContainer, PageHeader } from "@/shared/components/ui";
import { useNotasCredito } from "../hooks/useNotasCredito";
import { NotasCreditoToolbar } from "../components/NotasCredito/NotasCreditoToolbar";
import { NotasCreditoTable } from "../components/NotasCredito/NotasCreditoTable";
import { useDebounceValue } from "@/shared/hooks";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { IconFileInvoice, IconPlus } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import type { EstadoNota, NotasCreditoFilters } from "../types/notaCredito.types";

export default function NotasCreditoList() {
  const navigate = useNavigate();
  const { notas, isLoading, error, fetchNotas, applyFilters } = useNotasCredito();
  const { isCajaAbierta } = useCajaStore();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);
  const [filtroEstado, setFiltroEstado] = useState<EstadoNota | "">("");

  useEffect(() => {
    fetchNotas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFirstFilterRender = useRef(true);

  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }

    const normalizedSearch = debouncedSearchTerm.trim();
    const filters: NotasCreditoFilters = {
      ...(normalizedSearch ? { search: normalizedSearch } : {}),
      ...(filtroEstado ? { estado: filtroEstado } : {}),
    };
    applyFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filtroEstado]);

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Notas de Crédito" subtitle="Error al cargar datos" icon={<IconFileInvoice size={24} />} />
        <Card className="border-danger-100 bg-danger-50/30">
          <Card.Content className="py-8 text-center">
            <p className="text-danger-600 mb-6 font-medium">{error}</p>
            <Button onClick={() => fetchNotas()} variant="danger">Reintentar</Button>
          </Card.Content>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Notas de Crédito"
        subtitle="Gestiona las devoluciones y saldos a favor"
        icon={<IconFileInvoice size={24} />}
        actions={
          <Button
            onClick={() => navigate("../notas_credito/nueva", { relative: "route" })}
            disabled={!isCajaAbierta}
            className="w-full sm:w-auto shadow-lg shadow-primary-100"
          >
            <IconPlus size={18} />
            <span className="ml-2">Nueva Nota Crédito</span>
          </Button>
        }
      />

      <Card className="shadow-sm border-primary-100/50 mb-4">
        <Card.Content className="p-4">
          <NotasCreditoToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filtroEstado={filtroEstado}
            onFiltroEstadoChange={setFiltroEstado}
          />
        </Card.Content>
      </Card>

      <Card className="shadow-sm border-primary-100 overflow-hidden">
        <Card.Content className="p-0">
          <NotasCreditoTable notas={notas} isLoading={isLoading} />
        </Card.Content>
      </Card>
    </PageContainer>
  );
}
