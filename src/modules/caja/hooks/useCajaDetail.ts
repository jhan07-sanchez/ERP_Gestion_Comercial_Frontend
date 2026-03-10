import { useState } from "react";
import { cajaAPI } from "../api/Caja.api";
import type { Caja } from "../types/Caja.types";

export function useCajaDetail() {
  const [caja, setCaja] = useState<Caja | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const fetchCaja = async (id: number) => {
    setIsLoadingDetail(true);

    try {
      const data = await cajaAPI.getCaja(id);
      setCaja(data);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return {
    caja,
    fetchCaja,
    isLoadingDetail,
  };
}
