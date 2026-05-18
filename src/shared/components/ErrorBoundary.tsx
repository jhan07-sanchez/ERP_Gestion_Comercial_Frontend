/**
 * Error Boundary para capturar errores de React y mostrar UI de fallback.
 * Evita que toda la app se caiga por un error en un componente hijo.
 */

import { Component } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-96 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-primary-900 mb-2">Algo salió mal</h2>
            <p className="text-primary-600 mb-4">{this.state.error.message}</p>
            <Button
              variant="primary"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Reintentar
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
