import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api/api.js";
import ProductDetails from "../pages/ProductsDetails.jsx";
import "../pages/css/home.css";
import "../css/card-simple.css";

export default function CardProducto() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Función para truncar descripción a las primeras 3 palabras
  const truncateDescription = (description) => {
    if (!description) return "Sin descripción";
    const words = description.trim().split(/\s+/);
    if (words.length <= 3) return description;
    return words.slice(0, 3).join(' ') + '...';
  };

  useEffect(() => {
    // Obtener el rol del usuario del localStorage
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await api.obtenerProductos();
      setProductos(Array.isArray(res) ? res : res?.data || []);
    } catch (error) {
      console.error("❌ Error al cargar productos:", error);
      Swal.fire("Error", "No se pudieron obtener los productos", "error");
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

  useEffect(() => {
    cargarProductos();
    cargarProveedores();
  }, []);

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

  const handleCardClick = (producto) => {
    setSelectedProducto(producto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProducto(null);
  };

  return (
    <div className="compact-container">
      <h1 className="products-title">
        📦 Lista de Productos
      </h1>

      {productos.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No hay productos registrados todavía.
        </p>
      ) : (
        <div className="cards-wrapper">
          {productos.map((producto) => (
            <div
              key={producto._id}
              className="card simple-card clickable-card"
              onClick={() => handleCardClick(producto)}
            >
              {producto.imagen ? (
                <img src={producto.imagen} alt={producto.nombre} className="card-image" />
              ) : (
                <div className="card-image card-image--placeholder">Sin imagen</div>
              )}

              <div className="simple-card-content">

                {/* FILA 1: NOMBRE + PRECIO */}
                <div className="top-info">
                  <h3 className="product-name">{producto.nombre}</h3>
                  <div className="price-tag">${Number(producto.precio).toFixed(2)}</div>
                </div>

                {/* FILA 2: DESCRIPCIÓN */}
                <p className="product-description">{truncateDescription(producto.descripcion)}</p>

                {/* FILA 3: STOCK + ESTADO + PRECIOS */}
                <div className="info-row">
                  <div className="stock-info">
                    <span>Stock: {producto.stock}</span>
                    <div className={`status-dot ${Number(producto.stock) > 0 ? 'available' : 'unavailable'}`}></div>
                  </div>
                  <div className="price-info">
                    <span>Compra: ${producto.precioCompra || "0"}</span>
                  </div>
                </div>

                {/* FILA 4: FECHAS */}
                <div className="dates-row">
                  <span>Cad: {producto.fechaCaducidad?.split("T")[0] || "--"}</span>
                  <span>Comp: {producto.fechaCompra?.split("T")[0] || "--"}</span>
                </div>

                {/* FILA 5: PROVEEDOR (si existe) */}
                {producto.provedor && (
                  <div className="provider-row">
                    <span>📦 {producto.provedor.nombre}</span>
                  </div>
                )}

              </div>

            </div>
          ))}
        </div>
      )}

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
  );
}
