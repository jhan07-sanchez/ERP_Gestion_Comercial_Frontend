import { useState } from 'react';
import { notasDebitoAPI } from '../api';
import type { NotaDebitoCreate, AnularNotaDebitoPayload } from '../types/notaDebito.types';
import { useAlert } from '@/shared/components/alerts';
import { isAxiosError } from 'axios';

function extractErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    return err.response?.data?.error || err.response?.data?.detail || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function useNotaDebitoActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();

  const createNota = async (data: NotaDebitoCreate) => {
    setIsSubmitting(true);
    try {
      const response = await notasDebitoAPI.createNota(data);
      showAlert('Éxito', 'success', { description: 'Borrador creado correctamente.' });
      return response;
    } catch (err: unknown) {
      showAlert('Error', 'error', { description: extractErrorMessage(err, 'Error al crear la nota de débito') });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const emitirNota = async (id: number) => {
    setIsSubmitting(true);
    try {
      const response = await notasDebitoAPI.emitirNota(id);
      showAlert('Emitida', 'success', { description: response.status || 'Nota emitida con éxito.' });
      return true;
    } catch (err: unknown) {
      showAlert('Error', 'error', { description: extractErrorMessage(err, 'Error al emitir la nota') });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const anularNota = async (id: number, payload: AnularNotaDebitoPayload) => {
    setIsSubmitting(true);
    try {
      await notasDebitoAPI.anularNota(id, payload);
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
