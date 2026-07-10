import { useState } from "react";
import { Modal, Button, Select } from "@/shared/components/ui";
import type { EmitirNotaCreditoPayload } from "../../types/notaCredito.types";

interface EmitirNotaCreditoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: EmitirNotaCreditoPayload) => Promise<void>;
  isLoading: boolean;
}

export function EmitirNotaCreditoModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: EmitirNotaCreditoModalProps) {
  const [tipoAplicacion, setTipoAplicacion] = useState<"SALDO_FAVOR" | "REEMBOLSO">("SALDO_FAVOR");
  const [revertirInventario, setRevertirInventario] = useState(false);

  const handleConfirm = () => {
    onConfirm({
      tipo_aplicacion: tipoAplicacion,
      revertir_inventario: revertirInventario,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Emitir Nota de Crédito">
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Por favor seleccione la política de aplicación financiera para esta nota de crédito. 
          Al emitir, el saldo de la factura se actualizará según corresponda.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary-900 block">Tipo de Aplicación</label>
          <Select
            value={tipoAplicacion}
            onChange={(value) => setTipoAplicacion(value as "SALDO_FAVOR" | "REEMBOLSO")}
            options={[
              { value: "SALDO_FAVOR", label: "Dejar como Saldo a Favor" },
              { value: "REEMBOLSO", label: "Reembolso Inmediato al Cliente" }
            ]}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-100">
          <input
            type="checkbox"
            id="revertir-inv"
            checked={revertirInventario}
            onChange={(e) => setRevertirInventario(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="revertir-inv" className="text-sm text-gray-700 cursor-pointer">
            Revertir inventario (Devolver los productos al stock)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Emitiendo..." : "Confirmar Emisión"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
