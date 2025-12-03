import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/api.js";
import "../css/FormularioProducto.css";

export default function FormularioProducto() {
  const navigate = useNavigate();
  
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    fechaCaducidad: "",
    fechaCompra: "",
    provedor: "",
    precioCompra: "",
    imagen: null
  });

  const [proveedores, setProveedores] = useState([]);

  // Cargar proveedores al iniciar
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

  // 🔹 Validaciones del formulario
  const validarFormulario = () => {
    const { precio, precioCompra, stock, fechaCompra, fechaCaducidad } = producto;

    // Validar que el precio de compra no sea mayor al precio de venta
    if (parseFloat(precioCompra) > parseFloat(precio)) {
      Swal.fire("Error de validación", "El precio de compra no puede ser mayor al precio de venta", "warning");
      return false;
    }

    // Validar que el stock sea mayor a 0
    if (parseInt(stock) <= 0) {
      Swal.fire("Error de validación", "El stock debe ser mayor a 0", "warning");
      return false;
    }

    // Validar que la fecha de caducidad no sea menor a la fecha de compra
    if (new Date(fechaCaducidad) < new Date(fechaCompra)) {
      Swal.fire("Error de validación", "La fecha de caducidad no puede ser anterior a la fecha de compra", "warning");
      return false;
    }

    return true;
  };

  // 🔹 Guardar producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!producto.imagen) {
      Swal.fire("Error", "Debes seleccionar una imagen", "warning");
      return;
    }

    // Ejecutar validaciones
    if (!validarFormulario()) {
      return;
    }

    try {
      const formDataProducto = new FormData();
      formDataProducto.append("nombre", producto.nombre);
      formDataProducto.append("descripcion", producto.descripcion);
      formDataProducto.append("precio", producto.precio);
      formDataProducto.append("stock", producto.stock);
      formDataProducto.append("fechaCaducidad", producto.fechaCaducidad);
      formDataProducto.append("fechaCompra", producto.fechaCompra);
      formDataProducto.append("provedor", producto.provedor);
      formDataProducto.append("precioCompra", producto.precioCompra);
      formDataProducto.append("imagen", producto.imagen);

      await api.guardarProducto(formDataProducto);

      Swal.fire("Éxito", "Producto creado correctamente", "success");

      // Limpiar formulario
      setProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        fechaCaducidad: "",
        fechaCompra: "",
        provedor: "",
        precioCompra: "",
        imagen: null
      });
      
      // Limpiar input file
      document.getElementById('imagen-input').value = '';
      
      // Redirigir a /principal
      navigate('/principal');
      
    } catch (error) {
      console.error("Error al guardar producto:", error);
      Swal.fire("Error", error.message || "No se pudo guardar el producto", "error");
    }
  };

  return (
    <div className="formulario-producto-container">
      <div className="producto-form-wrapper">
        <form onSubmit={handleSubmit} className="producto-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre del Producto *</label>
              <input
                type="text"
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Ej: Laptop Gamer"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Descripción *</label>
              <textarea
                name="descripcion"
                value={producto.descripcion}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Describe las características y detalles del producto..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Precio de Venta *</label>
              <input
                type="number"
                name="precio"
                value={producto.precio}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Ej: 1200"
                step="0.01"
                min="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Precio de Compra *</label>
              <input
                type="number"
                name="precioCompra"
                value={producto.precioCompra}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Ej: 900"
                step="0.01"
                min="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input
                type="number"
                name="stock"
                value={producto.stock}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Ej: 50"
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Compra *</label>
              <input
                type="date"
                name="fechaCompra"
                value={producto.fechaCompra}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Caducidad *</label>
              <input
                type="date"
                name="fechaCaducidad"
                value={producto.fechaCaducidad}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Proveedor *</label>
            <select
              name="provedor"
              value={producto.provedor}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Seleccionar proveedor...</option>
              {proveedores.map((prov) => (
                <option key={prov._id} value={prov._id}>
                  {prov.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Imagen del Producto *</label>
            <div className="file-input-container">
              <input
                id="imagen-input"
                type="file"
                name="imagen"
                onChange={handleChange}
                accept="image/*"
                required
                className="file-input"
              />
              <label htmlFor="imagen-input" className="file-input-label">
                {producto.imagen ? producto.imagen.name : "Seleccionar imagen..."}
              </label>
            </div>
            {producto.imagen && (
              <div className="file-name">Archivo seleccionado: {producto.imagen.name}</div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}