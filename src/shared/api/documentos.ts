/**
 * Descarga/visualización de PDFs del módulo documentos (requiere JWT en axios).
 */
import axiosInstance from "@/shared/api/axios";

async function openPdfBlob(path: string): Promise<void> {
  const response = await axiosInstance.get(path, { responseType: "blob" });
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 120_000);
}

/** Factura formal o recibo POS según tipo de venta. */
export function openVentaDocumentoPdf(
  ventaId: number,
  tipoDocumentoVenta: "FACTURA" | "RECIBO",
): Promise<void> {
  const path =
    tipoDocumentoVenta === "RECIBO"
      ? `documentos/venta/${ventaId}/recibo-pos/`
      : `documentos/venta/${ventaId}/factura/`;
  return openPdfBlob(path);
}

export function openCompraDocumentoPdf(compraId: number): Promise<void> {
  return openPdfBlob(`documentos/compra/${compraId}/pdf/`);
}
