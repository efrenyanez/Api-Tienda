import React, { useState, useEffect } from "react";
import Sidebar from "../components/sliderbar.jsx";
import Swal from "sweetalert2";
import api from "../api/api.js";

export default function CrearProducto() {
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    fechaCaducidad: "",
    fechaCompra: "",
    provedor: "",
    precioCompra: "",
    imagen: null
  });

  const [proveedores, setProveedores] = useState([]);

  // 🔹 Cargar proveedores al iniciar
  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const data = await api.obtenerProveedores();
        setProveedores(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
      }
    };
    cargarProveedores();
  }, []);

  // 🔹 Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      setProducto({ ...producto, imagen: files[0] });
    } else {
      setProducto({ ...producto, [name]: value });
    }
  };

  // 🔹 Guardar producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!producto.imagen) {
      Swal.fire("Error", "Debes seleccionar una imagen", "warning");
      return;
    }

    try {
      // 🔹 Crear FormData con archivo de imagen
      const formDataProducto = new FormData();
      formDataProducto.append("nombre", producto.nombre);
      formDataProducto.append("precio", producto.precio);
      formDataProducto.append("stock", producto.stock);
      formDataProducto.append("fechaCaducidad", producto.fechaCaducidad);
      formDataProducto.append("fechaCompra", producto.fechaCompra);
      formDataProducto.append("provedor", producto.provedor);
      formDataProducto.append("precioCompra", producto.precioCompra);
      formDataProducto.append("imagen", producto.imagen); // ✅ archivo real

      // 🔹 Guardar producto usando API
      await api.guardarProducto(formDataProducto);

      Swal.fire("Éxito", "Producto creado correctamente", "success");

      // Limpiar formulario
      setProducto({
        nombre: "",
        precio: "",
        stock: "",
        fechaCaducidad: "",
        fechaCompra: "",
        provedor: "",
        precioCompra: "",
        imagen: null
      });
    } catch (error) {
      console.error("Error al guardar producto:", error);
      Swal.fire(
        "Error",
        error.message || "No se pudo guardar el producto",
        "error"
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">Crear Producto</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
            className="border p-2 w-full"
          />
          <input
            type="number"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            placeholder="Precio"
            required
            className="border p-2 w-full"
          />
          <input
            type="number"
            name="stock"
            value={producto.stock}
            onChange={handleChange}
            placeholder="Stock"
            required
            className="border p-2 w-full"
          />
          <input
            type="date"
            name="fechaCaducidad"
            value={producto.fechaCaducidad}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
          <input
            type="date"
            name="fechaCompra"
            value={producto.fechaCompra}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
          <select
            name="provedor"
            value={producto.provedor}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          >
            <option value="">Selecciona un proveedor</option>
            {proveedores.map((prov) => (
              <option key={prov._id} value={prov._id}>
                {prov.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="precioCompra"
            value={producto.precioCompra}
            onChange={handleChange}
            placeholder="Precio de compra"
            required
            className="border p-2 w-full"
          />
          <input
            type="file"
            name="imagen"
            onChange={handleChange}
            accept="image/*"
            required
            className="border p-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar Producto
          </button>
        </form>
      </div>
    </div>
  );
}
