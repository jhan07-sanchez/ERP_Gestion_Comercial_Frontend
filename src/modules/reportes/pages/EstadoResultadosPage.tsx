import { useState, useMemo } from 'react';
import { PageContainer, PageHeader, Card } from '@shared/components/ui';
import { useEstadoResultados } from '../hooks/useReportes';
import { reportesDomain } from '../domain/reportes.domain';
import { ReportFilters } from '../components/ReportFilters';
import type { ReportFilterOptions } from '../types/reportes.types';
import { formatCurrency } from '@shared/utils/formatters';
import { IconArrowRight } from '@tabler/icons-react';

export function EstadoResultadosPage() {
  const [filtros, setFiltros] = useState<ReportFilterOptions>({});
  const { data: movimientos, isLoading, isError } = useEstadoResultados(filtros);

  const reporte = useMemo(() => {
    if (!movimientos) return null;
    return reportesDomain.procesarEstadoResultados(movimientos);
  }, [movimientos]);

  const metricasAvanzadas = useMemo(() => {
    if (!reporte) return null;
    const utilidadBruta = reportesDomain.calcularUtilidadBruta(reporte.ingresosOperativos, reporte.costoVentas);
    const utilidadOperativa = reportesDomain.calcularUtilidadOperativa(utilidadBruta, reporte.gastosOperativos);
    const utilidadNeta = reportesDomain.calcularUtilidadNeta(utilidadOperativa, reporte.impuestos);
    const margen = reportesDomain.calcularMargenOperativo(utilidadOperativa, reporte.ingresosOperativos);

    return { utilidadBruta, utilidadOperativa, utilidadNeta, margen };
  }, [reporte]);

  if (isError) {
    return (
      <PageContainer>
        <div className="text-center p-10 bg-danger-50 rounded-xl text-danger-600 font-bold">
          Error al cargar el reporte de Estado de Resultados.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Estado de Resultados"
        description="Análisis profundo de rentabilidad e ingresos vs costos."
      />

      <ReportFilters 
        filtros={filtros} 
        onChange={setFiltros} 
        onExport={(format) => void format /* TODO: Implementar exportación */} 
      />

      {isLoading || !reporte || !metricasAvanzadas ? (
        <div className="flex items-center justify-center h-64 text-primary-400">
          <div className="animate-spin h-8 w-8 border-4 border-accent-500 border-t-transparent rounded-full" />
          <span className="ml-3 font-semibold">Calculando reporte...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
          
          {/* Columna Principal - Estructura Financiera */}
          <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-primary-100">
            <Card.Content className="p-8">
              <h3 className="text-lg font-black text-primary-900 mb-6 border-b border-primary-100 pb-4">
                Estructura del Estado de Resultados
              </h3>
              
              <div className="space-y-4">
                {/* Ingresos */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-semibold text-primary-700">1. Ingresos Operativos</span>
                  <span className="text-sm font-bold text-success-600">{formatCurrency(reporte.ingresosOperativos)}</span>
                </div>
                {/* Costos */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-semibold text-primary-700">2. Menos: Costo de Ventas</span>
                  <span className="text-sm font-bold text-danger-600">({formatCurrency(reporte.costoVentas)})</span>
                </div>
                
                {/* Utilidad Bruta */}
                <div className="flex justify-between items-center py-4 border-t border-primary-100 bg-primary-50 px-4 rounded-lg">
                  <span className="text-sm font-black text-primary-900">= Utilidad Bruta</span>
                  <span className="text-sm font-black text-primary-900">{formatCurrency(metricasAvanzadas.utilidadBruta)}</span>
                </div>

                {/* Gastos Operativos */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-semibold text-primary-700">3. Menos: Gastos Operativos</span>
                  <span className="text-sm font-bold text-danger-600">({formatCurrency(reporte.gastosOperativos)})</span>
                </div>

                {/* Utilidad Operativa */}
                <div className="flex justify-between items-center py-4 border-t border-primary-100 bg-primary-50 px-4 rounded-lg">
                  <span className="text-sm font-black text-primary-900">= Utilidad Operativa</span>
                  <span className="text-sm font-black text-primary-900">{formatCurrency(metricasAvanzadas.utilidadOperativa)}</span>
                </div>

                {/* Impuestos */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-semibold text-primary-700">4. Menos: Impuestos</span>
                  <span className="text-sm font-bold text-danger-600">({formatCurrency(reporte.impuestos)})</span>
                </div>

                {/* UTILIDAD NETA */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-primary-800">
                  <span className="text-lg font-black text-primary-900 uppercase tracking-widest">Utilidad Neta</span>
                  <span className="text-2xl font-black text-accent-600">{formatCurrency(metricasAvanzadas.utilidadNeta)}</span>
                </div>
              </div>

            </Card.Content>
          </Card>

          {/* Columna Lateral - Resumen y Gráficos Pequeños */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-primary-100 bg-gradient-to-br from-accent-600 to-accent-800 text-white">
              <Card.Content className="p-6">
                <h4 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Margen Operativo</h4>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black">{metricasAvanzadas.margen.toFixed(2)}%</span>
                </div>
                <p className="text-xs mt-4 opacity-90 leading-relaxed">
                  Por cada $1 de ingreso, la empresa genera {formatCurrency(metricasAvanzadas.margen / 100)} de utilidad operativa.
                </p>
              </Card.Content>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-primary-100">
              <Card.Content className="p-6">
                <h4 className="text-sm font-bold text-primary-900 mb-4">Detalles Rápidos</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs p-2 bg-primary-50 rounded-lg">
                    <span className="text-primary-600 font-semibold">Total Movimientos</span>
                    <span className="font-bold text-primary-900">{reporte.detalles.length}</span>
                  </div>
                  <button className="w-full text-xs font-bold text-accent-600 flex items-center justify-center gap-1 p-2 hover:bg-accent-50 rounded-lg transition-colors">
                    Ver Auxiliares <IconArrowRight size={14} />
                  </button>
                </div>
              </Card.Content>
            </Card>
          </div>

        </div>
      )}
    </PageContainer>
  );
}
