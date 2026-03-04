import { useEffect, useState } from "react";
import { Card, Button, Input, Table, Badge } from "@/shared/components/ui";
import { useCategorias } from "../hooks/useCategorias";
import { useAlert } from "@/shared/components/alerts";

export default function CategoriasList() {
    const {
        categorias,
        isLoading,
        error,
        fetchCategorias,
        deleteCategoria,
    } = useCategorias();
    const { showAlert, confirm } = useAlert();

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    const filteredCategorias = categorias.filter(cat =>
        cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        const confirmar = await confirm(
            "Eliminar Categoría",
            "¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.",
            "critical"
        );

        if (confirmar) {
            try {
                await deleteCategoria(id);
                showAlert("Categoría Eliminada", "success");
            } catch (err) {
                console.error("Error al eliminar categoría:", err);
                showAlert("Error", "error", { description: "No se pudo eliminar la categoría." });
            }
        }
    };

    if (isLoading && categorias.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando categorías...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
                    <p className="text-gray-600 mt-1"> Gestión de las categorías del catálogo</p>
                </div>
                <Button onClick={() => showAlert("En Desarrollo", "info", { description: "La función de crear categoría estará disponible pronto." })}>
                    Nueva Categoría
                </Button>
            </div>

            <Card>
                <Card.Content>
                    <Input
                        placeholder="Buscar categorías..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Card.Content>
            </Card>

            <Card>
                <Card.Content className="overflow-x-auto">
                    {error && <p className="text-red-600 mb-4">{error}</p>}

                    <Table>
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Nombre</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Descripción</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-900">Estado</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-900">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategorias.map((categoria) => (
                                <tr key={categoria.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900 font-medium">{categoria.nombre}</td>
                                    <td className="py-3 px-4 text-gray-600">{categoria.descripcion || "-"}</td>
                                    <td className="py-3 px-4 text-center">
                                        <Badge variant={categoria.estado ? "success" : "danger"}>
                                            {categoria.estado ? "Activa" : "Inactiva"}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button size="sm" variant="secondary">Editar</Button>
                                            <Button size="sm" variant="danger" onClick={() => handleDelete(categoria.id)}>Eliminar</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategorias.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-500">
                                        No se encontraron categorías
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Content>
            </Card>
        </div>
    );
}
