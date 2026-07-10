import React, { useState, useEffect, useRef } from "react";
import { IconSearch, IconX, IconFileInvoice } from "@tabler/icons-react";
import { Input, Loader } from "@/shared/components/ui";
import { facturasVentaAPI } from "../../api";
import { useDebounceValue } from "@/shared/hooks";
import type { FacturaList } from "../../types";

interface BuscadorFacturasProps {
  onSelect: (facturaId: number) => void;
  selectedFactura?: FacturaList | null;
  onClear?: () => void;
}

export function BuscadorFacturas({ onSelect, selectedFactura, onClear }: BuscadorFacturasProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounceValue(searchTerm, 500);
  const [results, setResults] = useState<FacturaList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedFactura) {
      setSearchTerm(`${selectedFactura.numero || `#${selectedFactura.id}`} - ${selectedFactura.cliente_nombre}`);
      setIsOpen(false);
    }
  }, [selectedFactura]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedFactura && debouncedSearch === `${selectedFactura.numero || `#${selectedFactura.id}`} - ${selectedFactura.cliente_nombre}`) {
      return;
    }
    
    if (debouncedSearch.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await facturasVentaAPI.getFacturas({ search: debouncedSearch, page_size: 10 });
        setResults(response.results);
        setIsOpen(true);
      } catch (error) {
        console.error("Error buscando facturas", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch, selectedFactura]);

  const handleSelect = (factura: FacturaList) => {
    setSearchTerm(`${factura.numero || `#${factura.id}`} - ${factura.cliente_nombre}`);
    setIsOpen(false);
    onSelect(factura.id);
  };

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
    if (onClear) onClear();
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <IconSearch size={18} />
        </div>
        <Input
          type="text"
          className="pl-10 pr-10"
          placeholder="Buscar factura por número o cliente..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (selectedFactura && onClear) onClear();
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {searchTerm && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={handleClear}
          >
            <IconX size={18} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-4 flex justify-center">
              <Loader size="sm" />
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-60 overflow-auto py-1">
              {results.map((factura) => (
                <li
                  key={factura.id}
                  className="px-4 py-2 hover:bg-primary-50 cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => handleSelect(factura)}
                >
                  <div className="flex items-center">
                    <IconFileInvoice size={18} className="text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {factura.numero || `#${factura.id}`} - {factura.cliente_nombre}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total: ${factura.total} • Estado: {factura.estado}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              No se encontraron facturas.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
