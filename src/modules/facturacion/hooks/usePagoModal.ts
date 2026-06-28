import { useState } from 'react';
import { FacturacionService } from '../services/facturacionService';

export function usePagoModal(total: number, saldoPendiente?: number) {
  const maxPagar = saldoPendiente !== undefined ? saldoPendiente : total;
  
  const [metodo, setMetodo] = useState<string>("EFECTIVO");
  const [montoPagar, setMontoPagar] = useState<number>(maxPagar);
  const [montoRecibido, setMontoRecibido] = useState<number>(0);

  const [prevMaxPagar, setPrevMaxPagar] = useState<number>(maxPagar);

  if (maxPagar !== prevMaxPagar) {
    setPrevMaxPagar(maxPagar);
    setMontoPagar(maxPagar);
    setMontoRecibido(0);
    setMetodo("EFECTIVO");
  }

  const esEfectivo = metodo === "EFECTIVO";
  const esCredito = metodo === "CREDITO";

  const vuelto = esEfectivo ? FacturacionService.calcularVuelto(montoPagar, montoRecibido) : 0;

  const montoPagarValido = montoPagar > 0 && montoPagar <= maxPagar;
  const montoRecibidoValido = esEfectivo ? montoRecibido >= montoPagar : true;
  const esValido = montoPagarValido && montoRecibidoValido && (!esCredito || montoPagar > 0);

  return {
    metodo,
    setMetodo,
    montoPagar,
    setMontoPagar,
    montoRecibido,
    setMontoRecibido,
    maxPagar,
    esEfectivo,
    esCredito,
    vuelto,
    montoPagarValido,
    montoRecibidoValido,
    esValido
  };
}
