/**
 * Filtros para historial de cambios.
 */

import { useState } from 'react';
import { Button, Input, Card, Select } from '@/components/ui';
import type { LogAuditoriaFilters } from '../types';

interface HistorialCambiosFiltersProps {
  filters: LogAuditoriaFilters;
  onApply: (filters: LogAuditoriaFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
}

const MODULOS = [
  { value: '', label: 'Todos los módulos' },
  { value: 'USUARIOS', label: 'Usuarios' },
  { value: 'CLIENTES', label: 'Clientes' },
  { value: 'PROVEEDORES', label: 'Proveedores' },
  { value: 'INVENTARIO', label: 'Inventario' },
  { value: 'VENTAS', label: 'Ventas' },
  { value: 'COMPRAS', label: 'Compras' },
  { value: 'CONFIGURACION', label: 'Configuración' },
  { value: 'SISTEMA', label: 'Sistema' },
];

const ACCIONES = [
  { value: '', label: 'Todas las acciones' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGOUT', label: 'Logout' },
  { value: 'CREAR', label: 'Crear' },
  { value: 'ACTUALIZAR', label: 'Actualizar' },
  { value: 'ELIMINAR', label: 'Eliminar' },
  { value: 'ACCESO_DENEGADO', label: 'Acceso denegado' },
  { value: 'ERROR', label: 'Error' },
];

const NIVELES = [
  { value: '', label: 'Todos los niveles' },
  { value: 'INFO', label: 'Info' },
  { value: 'WARNING', label: 'Advertencia' },
  { value: 'ERROR', label: 'Error' },
  { value: 'CRITICAL', label: 'Crítico' },
];

export function HistorialCambiosFilters({
  filters,
  onApply,
  onReset,
  isLoading = false,
}: HistorialCambiosFiltersProps) {
  const [search, setSearch] = useState(filters.search ?? '');
  const [modulo, setModulo] = useState(filters.modulo ?? '');
  const [accion, setAccion] = useState(filters.accion ?? '');
  const [nivel, setNivel] = useState(filters.nivel ?? '');
  const [fechaInicio, setFechaInicio] = useState(filters.fecha_inicio ?? '');
  const [fechaFin, setFechaFin] = useState(filters.fecha_fin ?? '');

  const handleApply = () => {
    onApply({
      search: search || undefined,
      modulo: modulo || undefined,
      accion: accion || undefined,
      nivel: nivel || undefined,
      fecha_inicio: fechaInicio || undefined,
      fecha_fin: fechaFin || undefined,
    });
  };

  const handleReset = () => {
    setSearch('');
    setModulo('');
    setAccion('');
    setNivel('');
    setFechaInicio('');
    setFechaFin('');
    onReset();
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Filtros</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar en descripción, usuario, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          />
          <Select label="Módulo" value={modulo} onChange={(val) => setModulo(val)} options={MODULOS} />
          <Select label="Acción" value={accion} onChange={(val) => setAccion(val)} options={ACCIONES} />
          <Select label="Nivel" value={nivel} onChange={(val) => setNivel(val)} options={NIVELES} />
          <Input label="Desde" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          <Input label="Hasta" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleApply} disabled={isLoading}>
            Aplicar filtros
          </Button>
          <Button variant="ghost" onClick={handleReset}>
            Limpiar
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}
