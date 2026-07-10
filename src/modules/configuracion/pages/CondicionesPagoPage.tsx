import { useState, useMemo } from 'react';
import useCondicionesPago from '@/modules/configuracion/hooks/useCondicionesPago';
import { PageContainer, Modal } from '@/shared/components/ui';
import { CondicionPagoForm } from '../components/CondicionPagoForm';
import { CondicionPagoTable } from '../components/CondicionPagoTable';
import type { CondicionPago } from '@/modules/configuracion/types/configuracion.types';

// Nuevos componentes modulares
import { CondicionesPagoHeader } from '../components/CondicionesPago/CondicionesPagoHeader';
import { CondicionesPagoKPIs } from '../components/CondicionesPago/CondicionesPagoKPIs';
import { CondicionesPagoToolbar } from '../components/CondicionesPago/CondicionesPagoToolbar';

const CondicionesPagoPage: React.FC = () => {
    const { condiciones, isLoading, isSaving, refresh, toggleActivo, createCondicion, updateCondicion } = useCondicionesPago();
    
    // UI State
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCondicion, setEditingCondicion] = useState<CondicionPago | null>(null);
    
    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'inactive'
    const [sortBy, setSortBy] = useState('nombre'); // 'nombre' | 'dias'

    // Local Filtering & Sorting
    const filteredAndSortedCondiciones = useMemo(() => {
        let result = [...condiciones];

        // 1. Búsqueda por término
        if (searchTerm.trim() !== '') {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(c => 
                c.nombre.toLowerCase().includes(lowerSearch) || 
                c.dias_plazo.toString().includes(lowerSearch)
            );
        }

        // 2. Filtro por estado
        if (filterStatus === 'active') {
            result = result.filter(c => c.activo);
        } else if (filterStatus === 'inactive') {
            result = result.filter(c => !c.activo);
        }

        // 3. Ordenamiento
        result.sort((a, b) => {
            if (sortBy === 'nombre') {
                return a.nombre.localeCompare(b.nombre);
            } else if (sortBy === 'dias') {
                return a.dias_plazo - b.dias_plazo;
            }
            return 0;
        });

        return result;
    }, [condiciones, searchTerm, filterStatus, sortBy]);

    const isFiltered = searchTerm !== '' || filterStatus !== 'all';

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setSortBy('nombre');
    };

    return (
        <PageContainer>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <CondicionesPagoHeader 
                    onNewClick={() => setShowCreateForm(true)}
                    onRefreshClick={refresh}
                />

                <CondicionesPagoKPIs condiciones={condiciones} />

                <CondicionesPagoToolbar 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterStatus={filterStatus}
                    onFilterStatusChange={setFilterStatus}
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                    onClear={handleClearFilters}
                />

                {showCreateForm && (
                    <CondicionPagoForm
                        isSaving={isSaving}
                        title="Nueva condición de pago"
                        submitLabel="Crear condición"
                        onCancel={() => setShowCreateForm(false)}
                        onSubmit={async (payload) => {
                            await createCondicion(payload);
                            setShowCreateForm(false);
                        }}
                    />
                )}

                <CondicionPagoTable
                    condiciones={filteredAndSortedCondiciones}
                    isLoading={isLoading}
                    onToggleActivo={toggleActivo}
                    onEdit={setEditingCondicion}
                    isFiltered={isFiltered}
                    onClearFilters={handleClearFilters}
                    onNewClick={() => setShowCreateForm(true)}
                />

                <Modal
                    isOpen={Boolean(editingCondicion)}
                    title="Editar condición de pago"
                    onClose={() => setEditingCondicion(null)}
                >
                    {editingCondicion ? (
                        <CondicionPagoForm
                            isSaving={isSaving}
                            title="Editar condición de pago"
                            submitLabel="Guardar cambios"
                            initialValues={{
                                nombre: editingCondicion.nombre,
                                dias_plazo: editingCondicion.dias_plazo,
                                activo: editingCondicion.activo,
                            }}
                            onCancel={() => setEditingCondicion(null)}
                            onSubmit={async (payload) => {
                                await updateCondicion(editingCondicion.id, payload);
                                setEditingCondicion(null);
                            }}
                        />
                    ) : null}
                </Modal>
            </div>
        </PageContainer>
    );
};

export default CondicionesPagoPage;
