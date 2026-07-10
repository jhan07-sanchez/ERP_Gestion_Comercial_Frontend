import { useState } from 'react';
import { notasCreditoAPI } from '../api';
import type { NotaCreditoCreate, EmitirNotaCreditoPayload, AnularNotaCreditoPayload } from '../types/notaCredito.types';
import { useAlert } from '@/shared/components/alerts';
import { isAxiosError } from 'axios';

function extractErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    return err.response?.data?.error || err.response?.data?.detail || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function useNotaCreditoActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();

  const createNota = async (data: NotaCreditoCreate) => {
    setIsSubmitting(true);
    try {
      const response = await notasCreditoAPI.createNota(data);
      showAlert('Éxito', 'success', { description: 'Borrador creado correctamente.' });
      return response;
    } catch (err: unknown) {
      showAlert('Error', 'error', { description: extractErrorMessage(err, 'Error al crear la nota de crédito') });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const emitirNota = async (id: number, payload: EmitirNotaCreditoPayload) => {
    setIsSubmitting(true);
    try {
      const response = await notasCreditoAPI.emitirNota(id, payload);
      showAlert('Emitida', 'success', { description: response.status || 'Nota emitida con éxito.' });
      return true;
    } catch (err: unknown) {
      showAlert('Error', 'error', { description: extractErrorMessage(err, 'Error al emitir la nota') });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const anularNota = async (id: number, payload: AnularNotaCreditoPayload) => {
    setIsSubmitting(true);
    try {
      await notasCreditoAPI.anularNota(id, payload);
      showAlert('Anulada', 'success', { description: 'Nota anulada correctamente.' });
      return true;
    } catch (err: unknown) {
      showAlert('Error', 'error', { description: extractErrorMessage(err, 'Error al anular la nota') });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    createNota,
    emitirNota,
    anularNota,
  };
}
