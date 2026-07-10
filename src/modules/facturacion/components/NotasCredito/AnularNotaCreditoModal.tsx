import { useState } from "react";
import { Modal, Button, Input } from "@/shared/components/ui";

interface AnularNotaCreditoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => Promise<void>;
  isLoading: boolean;
}

export function AnularNotaCreditoModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: AnularNotaCreditoModalProps) {
  const [motivo, setMotivo] = useState("");

  const handleConfirm = () => {
    if (!motivo.trim()) return;
    onConfirm(motivo);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Anular Nota de Crédito">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          ¿Está seguro de que desea anular esta nota de crédito? Esta acción es irreversible.
        </p>

        <div>
          <label className="text-sm font-semibold text-primary-900 block mb-1">
            Motivo de la anulación *
          </label>
          <Input
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej. Error en los montos"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={isLoading || !motivo.trim()}>
            {isLoading ? "Anulando..." : "Confirmar Anulación"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
