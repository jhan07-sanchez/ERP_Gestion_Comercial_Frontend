import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui";
import { useProductoActions } from "../hooks";
import { useCategorias } from "../../../modules/categorias/hooks/useCategorias";
import {
    ProductoForm,
    type ProductoFormData,
} from "../components/ProductoForm";
import type { ProductoUpdateInput } from "../types";

export default function ProductoEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { getProducto, updateProducto, error } = useProductoActions();
    const {
        categorias,
        isLoading: loadingCategorias,
        fetchCategorias
    } = useCategorias();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Cargar categorías al montar
    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    // Estado del formulario (UI)
    const [formData, setFormData] = useState<ProductoFormData | null>(null);

    /**
     * Carga el producto y lo mapea a formato del formulario
     */
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
            } finally {
                setLoading(false);
            }
        };

        loadProducto();
    }, [id, getProducto]);

    /**
     * Convierte datos del formulario a formato del backend
     */
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

    /**
     * Maneja el envío del formulario
     */
    const handleSubmit = async () => {
        if (!id || !formData) return;

        setSubmitting(true);

        try {
            const apiData = convertToAPIFormat(formData);
            await updateProducto(Number(id), apiData);
            navigate("/productos");
        } catch (err) {
            console.error("❌ Error al actualizar producto:", err);
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Maneja cancelación
     */
    const handleCancel = () => {
        if (submitting) return;
        navigate("/productos");
    };

    if (loading || !formData) {
        return <p>Cargando producto...</p>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={submitting}
                >
                    ← Volver
                </Button>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
                    <p className="text-gray-600 mt-1">
                        Modifica la información del producto seleccionado
                    </p>
                </div>
            </div>

            {/* Formulario */}
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
        </div>
    );
}
