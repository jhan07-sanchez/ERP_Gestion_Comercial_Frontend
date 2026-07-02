import { useState } from 'react';
import useCondicionesPago from '@/modules/configuracion/hooks/useCondicionesPago';
import { PageContainer, PageHeader, Button, Modal } from '@/shared/components/ui';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { CondicionPagoForm } from '../components/CondicionPagoForm';
import { CondicionPagoTable } from '../components/CondicionPagoTable';
import type { CondicionPago } from '@/modules/configuracion/types/configuracion.types';

const CondicionesPagoPage: React.FC = () => {
    const { condiciones, isLoading, isSaving, refresh, toggleActivo, createCondicion, updateCondicion } = useCondicionesPago();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCondicion, setEditingCondicion] = useState<CondicionPago | null>(null);

    return (
        <PageContainer>
            <PageHeader title="Condiciones de Pago" subtitle="Administración de condiciones de pago" />

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                    <Button variant="primary" onClick={() => setShowCreateForm((value) => !value)}>
                        <IconPlus /> Nueva condición
                    </Button>
                    <Button variant="secondary" onClick={refresh}>
                        <IconRefresh /> Actualizar
                    </Button>
                </div>
            </div>

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
                condiciones={condiciones}
                isLoading={isLoading}
                onToggleActivo={toggleActivo}
                onEdit={setEditingCondicion}
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
        </PageContainer>
    );
};

export default CondicionesPagoPage;
