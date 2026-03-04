// src/components/ui/Card.tsx
/**
 * 📦 CARD COMPONENT
 * 
 * Componente Card inspirado en SAP Fiori
 * Contenedor versátil para agrupar información relacionada
 * 
 * CARACTERÍSTICAS:
 * - Sombra sutil profesional
 * - Padding consistente
 * - Header opcional
 * - Footer opcional
 * - Variantes de color
 * 
 * USO:
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Título</Card.Title>
 *   </Card.Header>
 *   <Card.Content>
 *     Contenido
 *   </Card.Content>
 * </Card>
 */

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean; // Efecto hover
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

// Componente principal Card
export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white
        rounded-card
        shadow-card
        border border-primary-200
        ${hover ? 'transition-all hover:shadow-md hover:border-primary-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Sub-componente: Header
Card.Header = function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-primary-100 ${className}`}>
      {children}
    </div>
  );
};

// Sub-componente: Title
Card.Title = function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold text-primary-900 ${className}`}>
      {children}
    </h3>
  );
};

// Sub-componente: Description
Card.Description = function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-primary-600 mt-1 ${className}`}>
      {children}
    </p>
  );
};

// Sub-componente: Content
Card.Content = function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

// Sub-componente: Footer
Card.Footer = function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-primary-100 bg-primary-50 rounded-b-card ${className}`}>
      {children}
    </div>
  );
};

// Export default
export default Card;