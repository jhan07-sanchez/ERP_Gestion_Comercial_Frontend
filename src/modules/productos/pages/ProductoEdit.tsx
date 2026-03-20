import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, PageContainer, PageHeader, Card } from "@/shared/components/ui";
import { useProductoActions } from "../hooks";
import { useCategorias } from "../../../modules/categorias/hooks/useCategorias";
import {
    ProductoForm,
    type ProductoFormData,
} from "../components/ProductoForm";
import type { ProductoUpdateInput } from "../types";
import { IconArrowLeft, IconEdit, IconAlertCircle } from "@tabler/icons-react";
import { useAlert } from "@/shared/components/alerts";

export default function ProductoEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const { getProducto, updateProducto, error } = useProductoActions();
    const {
        categorias,
        isLoading: loadingCategorias,
        fetchCategorias
    } = useCategorias();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    const [formData, setFormData] = useState<ProductoFormData | null>(null);

    useEffect(() => {
        const loadProducto = async () => {
            if (!id) return;

            try {
                const producto = await getProducto(Number(id));

                const mappedData: ProductoFormData = {
                    codigo: producto.codigo,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion ?? "",
                    categoria:
                        typeof producto.categoria === "object"
                            ? producto.categoria.id
                            : producto.categoria,
                    precio_venta: producto.precio_venta,
                    precio_compra: producto.precio_compra ?? 0,
                    stock_minimo: producto.stock_minimo,
                    estado: producto.estado,
                };

                setFormData(mappedData);
            } catch {
                showAlert("Error", "error", { description: "No se pudo cargar el producto." });
                navigate("/productos");
            } finally {
                setLoading(false);
            }
        };

        loadProducto();
    }, [id, getProducto, navigate, showAlert]);

    const convertToAPIFormat = (data: ProductoFormData): ProductoUpdateInput => {
        return {
            nombre: data.nombre,
            descripcion: data.descripcion,
            categoria: data.categoria,
            precio_venta: data.precio_venta,
            precio_compra: data.precio_compra,
            stock_minimo: data.stock_minimo,
            estado: data.estado,
        };
    };

    const handleSubmit = async () => {
        if (!id || !formData) return;

        setSubmitting(true);
        try {
            const apiData = convertToAPIFormat(formData);
            await updateProducto(Number(id), apiData);
            showAlert("Producto Actualizado", "success");
            navigate("/productos");
        } catch {
            showAlert("Error", "error", { description: "Error al actualizar el producto." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (submitting) return;
        navigate("/productos");
    };

    if (loading || !formData) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                    <p className="mt-4 text-primary-600 font-medium">Cargando producto...</p>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Editar Producto"
                subtitle={`Modificando: ${formData.nombre}`}
                icon={<IconEdit size={24} />}
                backButton={
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleCancel}
                        className="p-2 h-10 w-10 flex items-center justify-center rounded-xl"
                    >
                        <IconArrowLeft size={20} />
                    </Button>
                }
            />

            <div className="space-y-6">
                <ProductoForm
                    mode="edit"
                    value={formData}
                    categorias={categorias}
                    loadingCategorias={loadingCategorias}
                    submitting={submitting}
                    error={error}
                    onChange={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />

                <Card className="bg-amber-50 border-amber-100">
                    <Card.Content className="p-4 flex gap-3">
                        <IconAlertCircle className="text-amber-500 shrink-0" size={20} />
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-amber-900">Advertencia</h3>
                            <p className="text-xs text-amber-800 opacity-90">
                                Los cambios realizados afectarán a todas las ventas y compras futuras que utilicen este producto. 
                                El código de barras/SKU es único y debe mantenerse coherente.
                            </p>
                        </div>
                    </Card.Content>
                </Card>
            </div>
        </PageContainer>
    );
}
