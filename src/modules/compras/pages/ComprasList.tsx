import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompras } from "../hooks/useCompra";
import { useCompraActions } from "../hooks/useCompraActions";
import { CompraItem } from "../components/CompraItem";

export default function ComprasList() {
  const navigate = useNavigate();

  const { compras, loading, error, refresh } = useCompras();
  const {
    deleteCompra,
    loading: actionLoading,
    error: actionError,
  } = useCompraActions();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<
    "all" | "completed" | "cancelled" | "pending"
  >("all");


  // 🔎 Filtrar compras
  const filteredCompras = compras.filter((compra) => {
    const matchesSearch =
      compra.numero_factura?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.proveedor_nombre?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterEstado === "all" ||
      (filterEstado === "completed" && compra.estado === "RECIBIDO") ||
      (filterEstado === "cancelled" && compra.estado === "CANCELADO") ||
      (filterEstado === "pending" && compra.estado === "PENDIENTE");

    return matchesSearch && matchesFilter;
  });

  // ➕ Crear compra
  const handleCreate = () => {
    navigate("/compras/create");
  };

  // ✏️ Editar compra
  const handleEdit = (id: number) => {
    navigate(`/compras/edit/${id}`);
  };

  // 👁️ Ver detalle
  const handleViewDetail = (id: number) => {
    navigate(`/compras/${id}`);
  };

  // 🗑️ Eliminar compra
  const handleDelete = async (id: number) => {
    const success = await deleteCompra(id);
    if (success) {
      refresh();
    }
  };

  // 🧹 Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterEstado("all");
  };

  // ⏳ Loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando compras...</p>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-error">
          <h3>Error al cargar compras</h3>
          <p>{error}</p>
          <button onClick={refresh} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="compra-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Compras</h1>
          <p className="subtitle">
            Gestiona tus compras ({filteredCompras.length} de {compras.length})
          </p>
        </div>

        <button onClick={handleCreate} className="btn btn-primary">
          <span>➕</span> Nueva Compra
        </button>
      </div>

      {/* Error acciones */}
      {actionError && (
        <div className="alert alert-error">
          <p>{actionError}</p>
        </div>
      )}

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por proveedor o factura..."
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
            className={`filter-btn ${filterEstado === "all" ? "active" : ""}`}
            onClick={() => setFilterEstado("all")}
          >
            Todas ({compras.length})
          </button>
          <button
            className={`filter-btn ${
              filterEstado === "completed" ? "active" : ""
            }`}
            onClick={() => setFilterEstado("completed")}
          >
            Completadas (
            {compras.filter((c) => c.estado === "RECIBIDO").length})
          </button>
          <button
            className={`filter-btn ${
              filterEstado === "cancelled" ? "active" : ""
            }`}
            onClick={() => setFilterEstado("cancelled")}
          >
            Anuladas ({compras.filter((c) => c.estado === "CANCELADO").length})
          </button>
          <button
            className={`filter-btn ${
              filterEstado === "pending" ? "active" : ""
            }`}
            onClick={() => setFilterEstado("pending")}
          >
            Pendientes ({compras.filter((c) => c.estado === "PENDIENTE").length})
          </button>
        </div>

        {(searchTerm || filterEstado !== "all") && (
          <button
            onClick={handleClearFilters}
            className="btn btn-secondary btn-sm"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Lista */}
      {filteredCompras.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧾</div>
          <h3>No se encontraron compras</h3>
          <p>
            {compras.length === 0
              ? "Comienza registrando tu primera compra"
              : "Prueba ajustando los filtros"}
          </p>
          {compras.length === 0 && (
            <button onClick={handleCreate} className="btn btn-primary">
              Crear Compra
            </button>
          )}
        </div>
      ) : (
        <div className="compras-grid">
          {filteredCompras.map((compra) => (
            <CompraItem
              key={compra.id}
              compra={compra}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleViewDetail}
            />
          ))}
        </div>
      )}

      {/* Overlay acciones */}
      {actionLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
