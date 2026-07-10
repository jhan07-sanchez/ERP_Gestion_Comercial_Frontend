import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader, Button } from "@/shared/components/ui";
import { NotaCreditoForm } from "../components/NotasCredito/NotaCreditoForm";
import { useNotaCreditoActions } from "../hooks/useNotaCreditoActions";
import { IconArrowLeft, IconFileInvoice } from "@tabler/icons-react";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import type { NotaCreditoCreate as NotaCreditoCreatePayload } from "../types/notaCredito.types";

export default function NotaCreditoCreate() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { createNota, isSubmitting } = useNotaCreditoActions();
  const { isCajaAbierta } = useCajaStore();

  const handleSubmit = async (data: NotaCreditoCreatePayload) => {
    if (!isCajaAbierta) {
      showAlert("Caja Cerrada", "warning", { description: "Debe abrir una sesión de caja antes de facturar." });
      return;
    }

    const nota = await createNota(data);
    if (nota) {
      navigate(`/facturacion/notas_credito/${nota.id}/detalle`);
    }
  };

  const handleCancel = () => {
    navigate("/facturacion/notas_credito/lista");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Nueva Nota de Crédito"
        subtitle="Registrar un borrador de devolución o descuento"
        icon={<IconFileInvoice size={24} />}
        backButton={
          <Button variant="ghost" onClick={handleCancel} className="mb-4">
            <IconArrowLeft size={18} className="mr-2" />
            Volver
          </Button>
        }
      />
      <div className="pb-20">
        <NotaCreditoForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitting={isSubmitting}
        />
      </div>
    </PageContainer>
  );
}
