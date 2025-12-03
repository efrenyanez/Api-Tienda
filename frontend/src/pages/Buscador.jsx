import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Layout from "../components/Layout";
import api from "../api/api.js";
import ProductDetails from "./ProductsDetails.jsx";
import "../css/buscador.css";

export default function Buscador() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener el rol del usuario del localStorage
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
    cargarProveedores();
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [searchTerm, filterType, productos]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res = await api.obtenerProductos();
      const productosData = Array.isArray(res) ? res : res?.data || [];
      setProductos(productosData);
      setProductosFiltrados(productosData);
    } catch (error) {
      console.error("❌ Error al cargar productos:", error);
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    } finally {
      setLoading(false);
    }
  };

  const cargarProveedores = async () => {
    try {
      const res = await api.obtenerProveedores();
      setProveedores(Array.isArray(res) ? res : res?.data || []);
    } catch (error) {
      console.error("❌ Error al cargar proveedores:", error);
    }
  };

  const filtrarProductos = () => {
    let filtered = productos;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (producto.provedor?.nombre && producto.provedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por tipo
    switch (filterType) {
      case "disponible":
        filtered = filtered.filter(producto => Number(producto.stock) > 0);
        break;
      case "agotado":
        filtered = filtered.filter(producto => Number(producto.stock) === 0);
        break;
      case "caducados":
        filtered = filtered.filter(producto => 
          new Date(producto.fechaCaducidad) < new Date()
        );
        break;
      case "vigentes":
        filtered = filtered.filter(producto => 
          new Date(producto.fechaCaducidad) >= new Date()
        );
        break;
      default:
        // "todos" - no filtrar
        break;
    }

    setProductosFiltrados(filtered);
  };

  const handleCardClick = (producto) => {
    setSelectedProducto(producto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProducto(null);
  };

  const eliminarProducto = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c31a19",
    });
    if (!confirmacion.isConfirmed) return;

    try {
      await api.eliminarProducto(id);
      Swal.fire({
        title: "Eliminado",
        text: "Producto eliminado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      cargarProductos();
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

  const editarProducto = async (producto) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Producto",
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${producto.nombre}">
        <textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${producto.descripcion || ''}</textarea>
        <input id="swal-precio" type="number" class="swal2-input" placeholder="Precio venta" value="${producto.precio}">
        <input id="swal-precioCompra" type="number" class="swal2-input" placeholder="Precio compra" value="${producto.precioCompra}">
        <input id="swal-stock" type="number" class="swal2-input" placeholder="Stock" value="${producto.stock}">
        <input id="swal-fechaCompra" type="date" class="swal2-input" value="${producto.fechaCompra.split('T')[0]}">
        <input id="swal-fechaCaducidad" type="date" class="swal2-input" value="${producto.fechaCaducidad.split('T')[0]}">
        <select id="swal-provedor" class="swal2-select">
          <option value="">Selecciona un proveedor</option>
          ${proveedores
          .map(
            (prov) =>
              `<option value="${prov._id}" ${producto.provedor?._id === prov._id ? "selected" : ""
              }>${prov.nombre}</option>`
          )
          .join("")}
        </select>
        <input id="swal-imagen" type="file" class="swal2-file" accept="image/*">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre").value;
        const descripcion = document.getElementById("swal-descripcion").value;
        const precio = document.getElementById("swal-precio").value;
        const precioCompra = document.getElementById("swal-precioCompra").value;
        const stock = document.getElementById("swal-stock").value;
        const fechaCompra = document.getElementById("swal-fechaCompra").value;
        const fechaCaducidad = document.getElementById("swal-fechaCaducidad").value;
        const provedor = document.getElementById("swal-provedor").value;
        const imagenInput = document.getElementById("swal-imagen");
        const imagen = imagenInput.files[0] || null;

        if (!nombre || !precio || !stock) {
          Swal.showValidationMessage("Completa los campos obligatorios");
          return false;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("descripcion", descripcion);
        formData.append("precio", precio);
        formData.append("precioCompra", precioCompra);
        formData.append("stock", stock);
        formData.append("fechaCompra", fechaCompra);
        formData.append("fechaCaducidad", fechaCaducidad);
        formData.append("provedor", provedor);
        if (imagen) formData.append("imagen", imagen);

        return formData;
      },
    });

    if (formValues) {
      try {
        await api.actualizarProducto(producto._id, formValues);
        Swal.fire("Éxito", "Producto actualizado correctamente", "success");
        cargarProductos();
      } catch (error) {
        console.error("❌ Error al actualizar producto:", error);
        Swal.fire("Error", "No se pudo actualizar el producto", "error");
      }
    }
  };

  const formatCurrency = (amount) => {
    return amount ? `$${Number(amount).toFixed(2)}` : '$0.00';
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('es-ES') : '--';
  };

  if (loading) {
    return (
      <Layout pageTitle="🔍 Buscador de Productos" activePage="search">
        <div className="buscador-loading">
          <h2>Cargando productos...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="🔍 Buscador de Productos" activePage="search">
      <div className="buscador-container">
        
        {/* CONTROLES DE BÚSQUEDA */}
        <div className="search-controls">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-container">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos los productos</option>
              <option value="disponible">En stock</option>
              <option value="agotado">Sin stock</option>
              <option value="vigentes">Vigentes</option>
              <option value="caducados">Caducados</option>
            </select>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="search-results">
          <div className="results-header">
            <h3>
              {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? 's' : ''}
            </h3>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="no-results">
              <p>📭 No se encontraron productos con los criterios de búsqueda.</p>
            </div>
          ) : (
            <div className="products-grid">
              {productosFiltrados.map((producto) => (
                <div
                  key={producto._id}
                  className="search-product-card"
                  onClick={() => handleCardClick(producto)}
                >
                  <div className="product-image-container">
                    {producto.imagen ? (
                      <img 
                        src={producto.imagen} 
                        alt={producto.nombre} 
                        className="product-search-image" 
                      />
                    ) : (
                      <div className="product-search-image-placeholder">
                        📷 Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="product-info">
                    <h4 className="product-title">{producto.nombre}</h4>
                    
                    <div className="product-price">
                      {formatCurrency(producto.precio)}
                    </div>

                    <div className="product-details">
                      <div className="detail-item">
                        <span className="label">Stock:</span>
                        <span className={`value ${Number(producto.stock) > 0 ? 'positive' : 'negative'}`}>
                          {producto.stock} unidades
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Estado:</span>
                        <span className={`value ${new Date(producto.fechaCaducidad) >= new Date() ? 'positive' : 'negative'}`}>
                          {new Date(producto.fechaCaducidad) >= new Date() ? 'Vigente' : 'Caducado'}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Caducidad:</span>
                        <span className="value">{formatDate(producto.fechaCaducidad)}</span>
                      </div>

                      {producto.provedor && (
                        <div className="detail-item">
                          <span className="label">Proveedor:</span>
                          <span className="value">{producto.provedor.nombre}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Detalles del Producto */}
        <ProductDetails
          producto={selectedProducto}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={editarProducto}
          onDelete={eliminarProducto}
          userRole={userRole}
        />
      </div>
    </Layout>
  );
}