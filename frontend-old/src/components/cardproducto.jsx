import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api/api.js";

export default function CardProducto() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

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
                `<option value="${prov._id}" ${
                  producto.provedor?._id === prov._id ? "selected" : ""
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        📦 Lista de Productos
      </h1>

      {productos.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No hay productos registrados todavía.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div
              key={producto._id}
              className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
            >
              {producto.imagen ? (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  Sin imagen
                </div>
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {producto.nombre}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  💰 <strong>Precio venta:</strong> ${producto.precio}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  🏷️ <strong>Precio compra:</strong> ${producto.precioCompra}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  📦 <strong>Stock:</strong> {producto.stock}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  📅 <strong>Compra:</strong>{" "}
                  {new Date(producto.fechaCompra).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  ⏳ <strong>Caducidad:</strong>{" "}
                  {new Date(producto.fechaCaducidad).toLocaleDateString()}
                </p>

                {producto.provedor ? (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-100 mb-3">
                    <p className="font-semibold text-gray-800">🧾 Proveedor</p>
                    <p>👤 {producto.provedor.nombre}</p>
                    <p>📍 {producto.provedor.direccion}</p>
                    <p>📞 {producto.provedor.telefono}</p>
                    <p>✉️ {producto.provedor.correo}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic">Sin proveedor asignado</p>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => editarProducto(producto)}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-all"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(producto._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
