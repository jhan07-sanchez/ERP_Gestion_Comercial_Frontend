import {
  formatCurrency,
  formatNumberInput,
  numberClass,
  parseNumberInput,
} from "@shared/utils/formatters";
import { IconPackage, IconMinus, IconPlus, IconTrash, IconShoppingCart } from "@tabler/icons-react";
import { Button } from "@shared/components/ui";
import type { FacturaDetalleFormState } from "../../types";

interface FacturaDetalleTableProps {
  detalles: FacturaDetalleFormState[];
  simbolo: string;
  updateDetalle: (index: number, field: keyof FacturaDetalleFormState, value: string | number) => void;
  removeDetalle: (index: number) => void;
}

export function FacturaDetalleTable({
  detalles,
  simbolo,
  updateDetalle,
  removeDetalle,
}: FacturaDetalleTableProps) {
  
  if (detalles.length === 0) {
    return (
      <div className="text-center py-16 bg-primary-50/50 border-2 border-dashed border-primary-100 rounded-2xl animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <IconShoppingCart size={32} className="text-primary-200" />
        </div>
        <h4 className="text-primary-400 font-bold tracking-tight">FACTURA VACÍA</h4>
        <p className="text-xs text-primary-400 mt-1 max-w-52 mx-auto">
          Agrega productos a la factura para continuar
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-3">
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-black text-primary-400 uppercase tracking-widest border-b border-primary-50">
        <div className="col-span-4">Producto</div>
        <div className="col-span-3 text-center">Cantidad</div>
        <div className="col-span-2 text-center">Precio Unit.</div>
        <div className="col-span-2 text-right">Subtotal</div>
        <div className="col-span-1"></div>
      </div>

      <div className="space-y-2">
        {detalles.map((detalle, index) => (
          <div
            key={detalle.id || index}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-primary-50/50 hover:bg-white p-4 rounded-xl border border-primary-100 transition-all hover:shadow-md hover:ring-1 hover:ring-accent-100 group"
          >
            <div className="col-span-1 md:col-span-4 flex items-center gap-3">
              <div className="hidden sm:flex w-10 h-10 bg-white rounded-lg border border-primary-100 items-center justify-center text-primary-400">
                <IconPackage size={20} />
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-primary-900 truncate">
                  {detalle.producto_nombre}
                </p>
                <p className="text-xs font-bold text-primary-400 overflow-hidden text-ellipsis">
                  REF: {detalle.producto_codigo} ·{" "}
                  <span className="text-accent-500">
                    DISP: {detalle.stock_disponible}
                  </span>
                </p>
              </div>
            </div>

            <div className="col-span-1 md:col-span-3 flex justify-center">
              <div className="flex items-center bg-white border border-primary-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() =>
                    updateDetalle(
                      index,
                      "cantidad",
                      Math.max(1, (Number(detalle.cantidad) || 0) - 1),
                    )
                  }
                  className="px-2 py-1.5 hover:bg-primary-50 text-primary-500 transition-colors border-r"
                >
                  <IconMinus size={14} />
                </button>
                <input
                  type="number"
                  value={detalle.cantidad === "" ? "" : detalle.cantidad}
                  onChange={(e) =>
                    updateDetalle(
                      index,
                      "cantidad",
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className={`w-12 text-center text-sm font-bold focus:outline-none ${numberClass}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    updateDetalle(
                      index,
                      "cantidad",
                      (Number(detalle.cantidad) || 0) + 1,
                    )
                  }
                  className="px-2 py-1.5 hover:bg-primary-50 text-primary-500 transition-colors border-l"
                >
                  <IconPlus size={14} />
                </button>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-center md:justify-start">
              <div className="relative w-full max-w-36">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-400">
                  {simbolo}
                </span>
                <input
                  type="text"
                  value={formatNumberInput(
                    detalle.precio_unitario?.toString() ?? "",
                  )}
                  onChange={(e) =>
                    updateDetalle(
                      index,
                      "precio_unitario",
                      e.target.value === ""
                        ? ""
                        : Number(parseNumberInput(e.target.value)),
                    )
                  }
                  className={`w-full pl-5 pr-2 py-1.5 bg-white border border-primary-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-accent-100 focus:border-accent-400 outline-none transition-all ${numberClass}`}
                />
              </div>
            </div>

            <div
              className={`col-span-1 md:col-span-2 text-right md:text-right font-black text-accent-600 text-sm py-1 md:py-0 ${numberClass}`}
            >
              <span className="md:hidden text-xs text-primary-400 mr-2 uppercase">
                Subtotal:
              </span>
              {formatCurrency(detalle.subtotal || 0)}
            </div>

            <div className="col-span-1 flex justify-end">
              <Button
                type="button"
                variant="danger"
                onClick={() => removeDetalle(index)}
                className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IconTrash size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
