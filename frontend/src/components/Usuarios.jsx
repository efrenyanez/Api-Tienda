import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../css/usuarios.css"; // Opcional: Agregar estilos personalizados para la tabla

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await api.obtenerUsuarios();
        setUsuarios(Array.isArray(data.usuarios) ? data.usuarios : []); // Asegurar que sea un arreglo
      } catch {
        setError("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await api.eliminarUsuario(id);
        setUsuarios(usuarios.filter((user) => user._id !== id));
      } catch {
        alert("Error al eliminar usuario");
      }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.asignarRol(id, newRole);
      setUsuarios(
        usuarios.map((user) =>
          user._id === id ? { ...user, rol: newRole } : user
        )
      );
    } catch {
      alert("Error al asignar rol");
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user._id}>
              <td>{user.correo}</td>
              <td>
                <select
                  value={user.rol}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(user._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}