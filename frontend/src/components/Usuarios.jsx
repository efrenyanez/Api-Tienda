import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext";
import "../css/usuarios.css";

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();

  useEffect(() => {
    if (hasRole('admin')) {
      cargarUsuarios();
    } else {
      setLoading(false);
    }
  }, [hasRole]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.obtenerUsuarios();
      setUsuarios(response.usuarios || []);
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const cambiarRol = async (usuarioId, nuevoRol) => {
    try {
      const confirmacion = await Swal.fire({
        title: "¿Cambiar rol de usuario?",
        text: `Se cambiará el rol a: ${nuevoRol}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#28a745",
      });

      if (!confirmacion.isConfirmed) return;

      await api.actualizarUsuario(usuarioId, { rol: nuevoRol });
      
      Swal.fire({
        title: "Rol actualizado",
        text: "El rol del usuario se ha cambiado correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      cargarUsuarios(); // Recargar la lista
    } catch (error) {
      console.error("❌ Error al cambiar rol:", error);
      Swal.fire("Error", error.message || "No se pudo cambiar el rol", "error");
    }
  };

  const eliminarUsuario = async (usuarioId, correoUsuario) => {
    try {
      const confirmacion = await Swal.fire({
        title: "¿Eliminar usuario?",
        text: `Se eliminará el usuario: ${correoUsuario}`,
        html: `
          <p>Se eliminará el usuario: <strong>${correoUsuario}</strong></p>
          <p style="color: #dc3545; font-weight: bold;">Esta acción no se puede deshacer</p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc3545",
      });

      if (!confirmacion.isConfirmed) return;

      await api.eliminarUsuario(usuarioId);
      
      Swal.fire({
        title: "Usuario eliminado",
        text: "El usuario se ha eliminado correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      cargarUsuarios(); // Recargar la lista
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
      Swal.fire("Error", error.message || "No se pudo eliminar el usuario", "error");
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible";
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case 'admin':
        return 'badge-admin';
      case 'gerente':
        return 'badge-gerente';
      case 'cajero':
        return 'badge-cajero';
      case 'pendiente':
        return 'badge-pendiente';
      default:
        return 'badge-default';
    }
  };

  if (!hasRole('admin')) {
    return (
      <div className="usuarios-container">
        <div className="access-denied">
          <h2>🚫 Acceso Denegado</h2>
          <p>Solo los administradores pueden ver la gestión de usuarios.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="usuarios-container">
        <div className="loading">
          <h2>⏳ Cargando usuarios...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h1>👥 Gestión de Usuarios</h1>
        <p>Total de usuarios: {usuarios.length}</p>
      </div>

      {usuarios.length === 0 ? (
        <div className="no-usuarios">
          <p>No hay usuarios registrados todavía.</p>
        </div>
      ) : (
        <div className="usuarios-table-wrapper">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol Actual</th>
                <th>Fecha Registro</th>
                <th>Cambiar Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario._id}>
                  <td className="user-name">{usuario.nombre || ""}</td>
                  <td className="user-email">{usuario.correo}</td>
                  <td>
                    <span className={`rol-badge ${getRolBadgeClass(usuario.rol)}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="fecha-registro">
                    {formatearFecha(usuario.createdAt)}
                  </td>
                  <td className="rol-selector">
                    <select
                      value={usuario.rol}
                      onChange={(e) => cambiarRol(usuario._id, e.target.value)}
                      className="rol-select"
                      disabled={usuario._id === user?.id} // No permitir cambiar su propio rol
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="cajero">Cajero</option>
                      <option value="gerente">Gerente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="acciones">
                    <button
                      onClick={() => eliminarUsuario(usuario._id, usuario.correo)}
                      className="btn-eliminar"
                      disabled={usuario._id === user?.id} // No permitir eliminarse a sí mismo
                      title={usuario._id === user?.id ? "No puedes eliminarte a ti mismo" : "Eliminar usuario"}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}