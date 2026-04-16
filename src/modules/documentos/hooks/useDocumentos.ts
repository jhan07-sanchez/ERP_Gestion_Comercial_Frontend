/**
 * 🎣 HOOK PARA EL MÓDULO DOCUMENTOS
 */

import { useState, useCallback, useEffect } from "react";
import { documentosAPI } from "../api/documentos.api";
import type { 
  DocumentoList, 
  DocumentoFilters 
} from "../types/documentos.types";
import { toast } from "react-hot-toast";

export function useDocumentos() {
  const [documentos, setDocumentos] = useState<DocumentoList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<DocumentoFilters>({
    tipo: "",
    search: "",
  });

  const fetchDocumentos = useCallback(
    async (page = 1, currentFilters = filters) => {
      setLoading(true);
      setError(null);
      try {
        const response = await documentosAPI.getDocumentos(currentFilters, page);
        setDocumentos(response.results);
        setTotalItems(response.count);
        setCurrentPage(page);
      } catch {
        const msg = "Error al cargar documentos";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const handleDownloadPDF = async (id: number, numero: string) => {
    try {
      toast.loading("Generando PDF...", { id: "download" });
      await documentosAPI.descargarPDF(id, `${numero}.pdf`);
      toast.success("Documento descargado correctamente", { id: "download" });
    } catch {
      toast.error("Error al descargar el PDF", { id: "download" });
    }
  };

  const applyFilters = (newFilters: DocumentoFilters) => {
    setFilters(newFilters);
    fetchDocumentos(1, newFilters);
  };

  // Carga inicial
  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  return {
    documentos,
    loading,
    error,
    totalItems,
    currentPage,
    filters,
    fetchDocumentos,
    applyFilters,
    handleDownloadPDF,
  };
}
