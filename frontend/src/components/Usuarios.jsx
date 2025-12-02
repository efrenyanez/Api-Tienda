import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../css/usuarios.css"; // Opcional: Agregar estilos personalizados para la tabla
import Layout from "../components/Layout";
import FormularioProveedor from "../components/FormularioProveedor";

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await api.obtenerUsuarios();
        setUsuarios(data);
      } catch (err) {
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
        setUsuarios(usuarios.filter((user) => user.id !== id));
      } catch (err) {
        alert("Error al eliminar usuario");
      }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.asignarRol(id, newRole);
      setUsuarios(
        usuarios.map((user) =>
          user.id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      alert("Error al asignar rol");
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <h1>Gestión de Usuarios</h1>
      <FormularioProveedor />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}