import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Hook para renderizar tooltips mediante Portals.
 * Resuelve el problema de tooltips cortados por contenedores con `overflow-hidden` o `overflow-auto`.
 * 
 * @returns { tooltipProps, renderTooltip }
 */
export function usePortalTooltip<T extends HTMLElement = HTMLElement>() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isHovered && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 12, // 12px de margen a la derecha del elemento
      });
    }
  }, [isHovered]);

  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);

  const renderTooltip = (label: string, disabled: boolean = false) => {
    if (disabled || !isHovered) return null;
    
    return createPortal(
      <div
        className="fixed z-[9999] px-2.5 py-1.5 bg-primary-900 text-white rounded-md text-xs font-medium whitespace-nowrap pointer-events-none shadow-lg"
        style={{ 
          top: coords.top, 
          left: coords.left, 
          transform: "translateY(-50%)",
          animation: "sidebar-tooltip-in 150ms ease-out forwards" 
        }}
      >
        {label}
      </div>,
      document.body
    );
  };

  return { ref, onMouseEnter, onMouseLeave, renderTooltip };
}
