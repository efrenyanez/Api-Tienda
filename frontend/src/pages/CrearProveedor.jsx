// src/pages/CrearProveedor.jsx

import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/api.js";
import Sidebar from "../components/sliderbar.jsx";

export default function CrearProveedor() {
  const [proveedor, setProveedor] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
  });

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  // 🔹 Validar campos básicos
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
    // Validación simple de correo
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

  // 🔹 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      // 🔹 Mostrar SweetAlert de carga
      Swal.fire({
        title: "Creando proveedor...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await api.guardarProveedor(proveedor);

      // 🔹 Cerrar carga y mostrar éxito
      Swal.fire({
        icon: "success",
        title: "Proveedor creado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });

      // Limpiar formulario
      setProveedor({
        nombre: "",
        direccion: "",
        telefono: "",
        correo: "",
      });
    } catch (error) {
      Swal.close(); // cerrar loader si hay error

      const mensaje =
        error.message === "El proveedor ya existe"
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Crear Proveedor</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg"
        >
          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={proveedor.nombre}
              onChange={handleChange}
              placeholder="Nombre del proveedor"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Dirección */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={proveedor.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Teléfono */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={proveedor.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Correo */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo
            </label>
            <input
              type="email"
              name="correo"
              value={proveedor.correo}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Crear Proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
