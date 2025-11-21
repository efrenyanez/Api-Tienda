import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/api.js";
import "../css/FormularioProveedor.css";

export default function FormularioProveedor() {
  const [proveedor, setProveedor] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
  });

  const handleChange = (e) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  const validarCampos = () => {
    const { nombre, direccion, telefono, correo } = proveedor;
    if (!nombre || !direccion || !telefono || !correo) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos.",
      });
      return false;
    }
    
    const regexCorreo = /^\S+@\S+\.\S+$/;
    if (!regexCorreo.test(correo)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Ingresa un correo válido.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      Swal.fire({
        title: "Creando proveedor...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await api.guardarProveedor(proveedor);

      Swal.fire({
        icon: "success",
        title: "Proveedor creado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });

      setProveedor({
        nombre: "",
        direccion: "",
        telefono: "",
        correo: "",
      });
    } catch (error) {
      Swal.close();
      const mensaje = error.message === "El proveedor ya existe"
        ? "Ya existe un proveedor con ese nombre."
        : "No se pudo crear el proveedor.";
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje,
      });
      console.error("Error al crear proveedor:", error);
    }
  };

  return (
    <div className="formulario-proveedor-container">
      <div className="formulario-proveedor-header">
        <h1 className="formulario-proveedor-title">🏢 Crear Nuevo Proveedor</h1>
        <p className="formulario-proveedor-subtitle">Completa la información del proveedor</p>
      </div>

      <div className="proveedor-form-wrapper">
        <form onSubmit={handleSubmit} className="proveedor-form">
          <div className="proveedor-form-grid">
            <div className="form-group">
              <label className="form-label">Nombre del Proveedor *</label>
              <input
                type="text"
                name="nombre"
                value={proveedor.nombre}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Ej: TecnoSupply S.A."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dirección *</label>
              <input
                type="text"
                name="direccion"
                value={proveedor.direccion}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Ej: Av. Principal #123, Ciudad"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono *</label>
              <input
                type="text"
                name="telefono"
                value={proveedor.telefono}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Ej: +1 234 567 890"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correo Electrónico *</label>
              <input
                type="email"
                name="correo"
                value={proveedor.correo}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Ej: contacto@proveedor.com"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Crear Proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}