import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader, Button } from "@/shared/components/ui";
import { NotaDebitoForm } from "../components/NotasDebito/NotaDebitoForm";
import { useNotaDebitoActions } from "../hooks/useNotaDebitoActions";
import { IconArrowLeft, IconFileInvoice } from "@tabler/icons-react";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import type { NotaDebitoCreate as NotaDebitoCreatePayload } from "../types/notaDebito.types";

export default function NotaDebitoCreate() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { createNota, isSubmitting } = useNotaDebitoActions();
  const { isCajaAbierta } = useCajaStore();

  const handleSubmit = async (data: NotaDebitoCreatePayload) => {
    if (!isCajaAbierta) {
      showAlert("Caja Cerrada", "warning", { description: "Debe abrir una sesión de caja antes de facturar." });
      return;
    }

    const nota = await createNota(data);
    if (nota) {
      navigate(`/facturacion/notas_debito/${nota.id}/detalle`);
    }
  };

  const handleCancel = () => {
    navigate("/facturacion/notas_debito/lista");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Nueva Nota de Débito"
        subtitle="Registrar un cargo adicional o interés"
        icon={<IconFileInvoice size={24} />}
        backButton={
          <Button variant="ghost" onClick={handleCancel} className="mb-4">
            <IconArrowLeft size={18} className="mr-2" />
            Volver
          </Button>
        }
      />
      <div className="pb-20">
        <NotaDebitoForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitting={isSubmitting}
        />
      </div>
    </PageContainer>
  );
}
