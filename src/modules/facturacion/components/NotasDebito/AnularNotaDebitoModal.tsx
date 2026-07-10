import { useState } from "react";
import { Modal, Button, Input } from "@/shared/components/ui";

interface AnularNotaDebitoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => Promise<void>;
  isLoading: boolean;
}

export function AnularNotaDebitoModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: AnularNotaDebitoModalProps) {
  const [motivo, setMotivo] = useState("");

  const handleConfirm = () => {
    if (!motivo.trim()) return;
    onConfirm(motivo);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Anular Nota de Débito">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          ¿Está seguro de que desea anular esta nota de débito? Se revertirá el cargo a la deuda del cliente.
        </p>

        <div>
          <label className="text-sm font-semibold text-primary-900 block mb-1">
            Motivo de la anulación *
          </label>
          <Input
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej. Cargo aplicado por error"
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
