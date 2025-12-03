import React from "react";
import Swal from "sweetalert2";
import "./css/productDetails.css";

const ProductDetails = ({ producto, onClose, isOpen, onEdit, onDelete, userRole }) => {
  if (!isOpen || !producto) return null;

  // Determinar si el usuario tiene permisos para editar/eliminar
  const canEditDelete = userRole === 'admin' || userRole === 'gerente';
  const isCajero = userRole === 'cajero';

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('es-ES') : 'No especificada';
  };

  const formatCurrency = (amount) => {
    return amount ? `$${Number(amount).toFixed(2)}` : '$0.00';
  };

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

  const handleDelete = () => {
    onClose(); // Cerrar el modal de detalles
    if (onDelete) {
      onDelete(producto._id); // Llamar la función de eliminación del componente padre
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">📦 Detalles del Producto</h2>
          <div className="modal-actions">
            {/* Los botones de Editar y Eliminar solo se muestran para Admin y Gerente */}
            {canEditDelete && (
              <>
                <button className="action-btn edit-btn" onClick={handleEdit}>
                  ✏️ Editar
                </button>
                <button className="action-btn delete-btn" onClick={handleDelete}>
                  🗑️ Eliminar
                </button>
              </>
            )}
            {/* Para Cajero, mostrar un mensaje informativo */}
            {isCajero && (
              <span className="cajero-badge" title="Como cajero solo puedes ver los detalles">
                👁️ Solo lectura
              </span>
            )}
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
              <div className="detail-row">
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
                  <label>Estado del Producto</label>
                  <span className={`status-badge ${new Date(producto.fechaCaducidad) > new Date() ? 'valid' : 'expired'}`}>
                    {new Date(producto.fechaCaducidad) > new Date() ? '✅ Vigente' : '⚠️ Caducado'}
                  </span>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <label>Fecha de Compra</label>
                  <span>{formatDate(producto.fechaCompra)}</span>
                </div>

                <div className="detail-item">
                  <label>Fecha de Caducidad</label>
                  <span>{formatDate(producto.fechaCaducidad)}</span>
                </div>
              </div>

              <div className="detail-item full-width">
                <label>Proveedor</label>
                <span className="provider-name">
                  {producto.provedor ? producto.provedor.nombre : 'No asignado'}
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