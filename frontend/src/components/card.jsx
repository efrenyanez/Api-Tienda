import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api/api.js";

export default function CardProveedor() {
  const [proveedores, setProveedores] = useState([]);

  // 🔹 Cargar lista de proveedores
  const cargarProveedores = async () => {
    try {
      const res = await api.obtenerProveedores(); // 🔹 Usar el nombre correcto
      // Si tu backend devuelve { data: [...] } o solo [...], adaptamos
      setProveedores(res?.data || res || []);
    } catch (error) {
      console.error("❌ Error al cargar proveedores:", error);
      Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  // 🔹 Confirmación reutilizable
  const confirmarAccion = (titulo, texto, icon = "warning") =>
    Swal.fire({
      title: titulo,
      text: texto,
      icon,
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

  // 🔹 Eliminar proveedor
  const eliminarProveedor = async (id) => {
    const { isConfirmed } = await confirmarAccion(
      "¿Eliminar proveedor?",
      "Esto eliminará al proveedor y sus datos asociados"
    );
    if (!isConfirmed) return;

    try {
      await api.eliminarProveedor(id);
      Swal.fire({
        title: "Eliminado",
        text: "El proveedor ha sido eliminado correctamente",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      cargarProveedores();
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el proveedor", "error");
    }
  };

  // 🔹 Editar proveedor
  const editarProveedor = async ({ _id, nombre, direccion, telefono, correo }) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Proveedor",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${nombre || ""}">
        <input id="direccion" class="swal2-input" placeholder="Dirección" value="${direccion || ""}">
        <input id="telefono" class="swal2-input" placeholder="Teléfono" value="${telefono || ""}">
        <input id="correo" class="swal2-input" type="email" placeholder="Correo" value="${correo || ""}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar cambios",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("nombre").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const correo = document.getElementById("correo").value.trim();

        if (!nombre || !direccion || !telefono || !correo) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        return { nombre, direccion, telefono, correo };
      },
    });

    if (!formValues) return;

    try {
      await api.actualizarProveedor(_id, formValues);
      Swal.fire({
        title: "Actualizado",
        text: "El proveedor fue actualizado correctamente",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      cargarProveedores();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el proveedor", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Proveedores</h2>

      {proveedores.length === 0 ? (
        <p className="text-gray-500 mb-8">No hay proveedores registrados.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {proveedores.map((prov) => (
            <div
              key={prov._id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800">{prov.nombre}</h3>
              <p className="text-sm text-gray-600 mt-1">📍 {prov.direccion}</p>
              <p className="text-sm text-gray-600 mt-1">📞 {prov.telefono}</p>
              <p className="text-sm text-gray-600 mt-1">✉️ {prov.correo}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => editarProveedor(prov)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarProveedor(prov._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
