import { useState } from 'react';
import { FacturacionService } from '../services/facturacionService';
import type { MetodoPago } from '@/modules/configuracion/types/configuracion.types';

export function usePagoModal(total: number, saldoPendiente?: number, metodos: MetodoPago[] = []) {
  const maxPagar = saldoPendiente !== undefined ? saldoPendiente : total;
  
  const defaultMetodo = metodos.length > 0 ? metodos[0].id.toString() : "1";
  const [metodo, setMetodo] = useState<string>(defaultMetodo);
  const [montoPagar, setMontoPagar] = useState<number>(maxPagar);
  const [montoRecibido, setMontoRecibido] = useState<number>(0);

  const [prevMaxPagar, setPrevMaxPagar] = useState<number>(maxPagar);

  if (maxPagar !== prevMaxPagar) {
    setPrevMaxPagar(maxPagar);
    setMontoPagar(maxPagar);
    setMontoRecibido(0);
    setMetodo(defaultMetodo);
  }

  const selectedMetodoObj = metodos.find(m => m.id.toString() === metodo);
  const esEfectivo = selectedMetodoObj?.es_efectivo || false;
  const esCredito = selectedMetodoObj?.tipo === 'CREDITO';

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
