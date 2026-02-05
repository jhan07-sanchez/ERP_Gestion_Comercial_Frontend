// proveedores/pages/ProveedorList.tsx

import {useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProveedor } from "../hooks/useProveedor";
import { useProveedorActions } from "../hooks/useProveedorActions";
import { ProveedorItem } from "../components/ProveedorItem";

export default function ProveedorList() {
  const navigate = useNavigate();
  const { proveedores, loading, error, refresh } = useProveedor();
  const {
    deleteProveedor,
    toggleActivoProveedor,
    loading: actionLoading,
    error: actionError,
  } = useProveedorActions();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterActivo, setFilterActivo] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Filtrar proveedores
  const filteredProveedores = proveedores.filter((proveedor) => {
    const matchesSearch =
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterActivo === "all" ||
      (filterActivo === "active" && proveedor.activo) ||
      (filterActivo === "inactive" && !proveedor.activo);

    return matchesSearch && matchesFilter;
  });

  // Navegar a crear proveedor
  const handleCreate = () => {
    navigate("/proveedores/create");
  };

  // Navegar a editar proveedor
  const handleEdit = (id: number) => {
    navigate(`/proveedores/edit/${id}`);
  };

  // Navegar a detalle del proveedor
  const handleViewDetail = (id: number) => {
    navigate(`/proveedores/${id}`);
  };

  // Eliminar proveedor
  const handleDelete = async (id: number) => {
    const success = await deleteProveedor(id);
    if (success) {
      refresh();
    }
  };

  // Cambiar estado activo/inactivo
  const handleToggleActivo = async (id: number, activo: boolean) => {
    const result = await toggleActivoProveedor(id, activo);
    if (result) {
      refresh();
    }
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterActivo("all");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando proveedores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-error">
          <h3>Error al cargar proveedores</h3>
          <p>{error}</p>
          <button onClick={refresh} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="proveedor-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Proveedores</h1>
          <p className="subtitle">
            Gestiona tus proveedores ({filteredProveedores.length} de{" "}
            {proveedores.length})
          </p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          <span>➕</span> Nuevo Proveedor
        </button>
      </div>

      {/* Mensaje de error de acciones */}
      {actionError && (
        <div className="alert alert-error">
          <p>{actionError}</p>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nombre, documento o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="clear-search"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterActivo === "all" ? "active" : ""}`}
            onClick={() => setFilterActivo("all")}
          >
            Todos ({proveedores.length})
          </button>
          <button
            className={`filter-btn ${filterActivo === "active" ? "active" : ""}`}
            onClick={() => setFilterActivo("active")}
          >
            Activos ({proveedores.filter((p) => p.activo).length})
          </button>
          <button
            className={`filter-btn ${filterActivo === "inactive" ? "active" : ""}`}
            onClick={() => setFilterActivo("inactive")}
          >
            Inactivos ({proveedores.filter((p) => !p.activo).length})
          </button>
        </div>

        {(searchTerm || filterActivo !== "all") && (
          <button
            onClick={handleClearFilters}
            className="btn btn-secondary btn-sm"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Lista de proveedores */}
      {filteredProveedores.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No se encontraron proveedores</h3>
          <p>
            {proveedores.length === 0
              ? "Comienza creando tu primer proveedor"
              : "Intenta ajustar los filtros de búsqueda"}
          </p>
          {proveedores.length === 0 && (
            <button onClick={handleCreate} className="btn btn-primary">
              Crear Proveedor
            </button>
          )}
        </div>
      ) : (
        <div className="proveedores-grid">
          {filteredProveedores.map((proveedor) => (
            <ProveedorItem
              key={proveedor.id}
              proveedor={proveedor}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActivo={handleToggleActivo}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      )}

      {/* Loading overlay para acciones */}
      {actionLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

