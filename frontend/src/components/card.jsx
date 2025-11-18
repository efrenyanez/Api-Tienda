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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Proveedores</h2>

      {proveedores.length === 0 ? (
        <p className="text-gray-500 mb-8">No hay proveedores registrados.</p>
      ) : (
        <div className="cards-wrapper providers">
          {proveedores.map((prov) => (
            <div key={prov._id} className="card provider-card">
              <h3 className="card-title">{prov.nombre}</h3>
              <p className="card-text">📍 {prov.direccion}</p>
              <p className="card-text">📞 {prov.telefono}</p>
              <p className="card-text">✉️ {prov.correo}</p>


            </div>
          ))}
        </div>
      )}
    </div>
  );
}
