import React from "react";
import Swal from "sweetalert2";
import "./css/productDetails.css";

const ProductDetails = ({ producto, onClose, isOpen, onEdit, onDelete }) => {
  if (!isOpen || !producto) return null;

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('es-ES') : 'No especificada';
  };

  const formatCurrency = (amount) => {
    return amount ? `$${Number(amount).toFixed(2)}` : '$0.00';
  };

  const calculateProfit = () => {
    const profit = producto.precio - producto.precioCompra;
    const profitPercentage = ((profit / producto.precioCompra) * 100).toFixed(1);
    return { profit, profitPercentage };
  };

  const { profit, profitPercentage } = calculateProfit();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEdit = () => {
    onClose(); // Cerrar el modal de detalles
    if (onEdit) {
      onEdit(producto); // Llamar la función de edición del componente padre
    }
  };

  const handleDelete = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar producto?",
      text: `¿Estás seguro de que quieres eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      background: "#374151",
      color: "#f9fafb",
      customClass: {
        popup: 'swal-dark-popup'
      }
    });

    if (confirmacion.isConfirmed) {
      onClose(); // Cerrar el modal de detalles
      if (onDelete) {
        onDelete(producto._id); // Llamar la función de eliminación del componente padre
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">📦 Detalles del Producto</h2>
          <div className="modal-actions">
            <button className="action-btn edit-btn" onClick={handleEdit}>
              ✏️ Editar
            </button>
            <button className="action-btn delete-btn" onClick={handleDelete}>
              🗑️ Eliminar
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="modal-content">
          <div className="product-image-section">
            {producto.imagen ? (
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="product-detail-image"
              />
            ) : (
              <div className="product-detail-image-placeholder">
                📷 Sin imagen
              </div>
            )}
          </div>

          <div className="product-info-section">
            <div className="product-header-info">
              <h3 className="product-name">{producto.nombre}</h3>
              <div className="product-prices">
                <div className="price-item sale-price">
                  <label>Precio de Venta</label>
                  <span>{formatCurrency(producto.precio)}</span>
                </div>
                <div className="price-item purchase-price">
                  <label>Precio de Compra</label>
                  <span>{formatCurrency(producto.precioCompra)}</span>
                </div>
              </div>
            </div>

            {producto.descripcion && (
              <div className="description-section">
                <label>Descripción</label>
                <p className="product-description">{producto.descripcion}</p>
              </div>
            )}

            <div className="product-details-grid">
              <div className="detail-item">
                <label>Stock Disponible</label>
                <div className="stock-info">
                  <span className={`stock-badge ${Number(producto.stock) > 0 ? 'in-stock' : 'out-stock'}`}>
                    {Number(producto.stock) > 0 ? '✅ En Stock' : '❌ Agotado'}
                  </span>
                  <span className="stock-quantity">{producto.stock} unidades</span>
                </div>
              </div>

              <div className="detail-item">
                <label>Proveedor</label>
                <span className="provider-name">
                  {producto.provedor ? producto.provedor.nombre : 'No asignado'}
                </span>
              </div>

              {/* <div className="detail-item">
                <label>Ganancia por Unidad</label>
                <div className="profit-info">
                  <span className={`profit-amount ${profit >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(profit)}
                  </span>
                  <span className={`profit-percentage ${profit >= 0 ? 'positive' : 'negative'}`}>
                    ({profit >= 0 ? '+' : ''}{profitPercentage}%)
                  </span>
                </div>
              </div> */}

              <div className="detail-item">
                <label>Fecha de Compra</label>
                <span>{formatDate(producto.fechaCompra)}</span>
              </div>

              <div className="detail-item">
                <label>Fecha de Caducidad</label>
                <span>{formatDate(producto.fechaCaducidad)}</span>
              </div>

              <div className="detail-item">
                <label>Estado del Producto</label>
                <span className={`status-badge ${new Date(producto.fechaCaducidad) > new Date() ? 'valid' : 'expired'}`}>
                  {new Date(producto.fechaCaducidad) > new Date() ? '✅ Vigente' : '⚠️ Caducado'}
                </span>
              </div>
            </div>

            {/* <div className="financial-summary">
              <h4>📊 Resumen Financiero</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <label>Inversión Total</label>
                  <span>{formatCurrency(producto.precioCompra * producto.stock)}</span>
                </div>
                <div className="summary-item">
                  <label>Valor en Inventario</label>
                  <span>{formatCurrency(producto.precio * producto.stock)}</span>
                </div>
                {/* <div className="summary-item">
                  <label>Ganancia Potencial</label>
                  <span className={profit >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(profit * producto.stock)}
                  </span>
                </div> 
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;