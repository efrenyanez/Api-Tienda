// src/api/api.js

const API_URL = "http://localhost:3000/api/v1";

// Función para obtener el token JWT
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Función para crear headers con autenticación
const getAuthHeaders = (includeContentType = true) => {
  const token = getAuthToken();
  const headers = {};
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Interceptor para manejar errores de autenticación
const handleAuthError = (response) => {
  if (response.status === 401) {
    // Token inválido o expirado
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  }
  return response;
};

const api = {
  // ================= PROVEEDORES =================
  // Crear proveedor (solo admin y gerente)
  guardarProveedor: async (proveedor) => {
    try {
      const res = await fetch(`${API_URL}/proveedores/guardarProveedor`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(proveedor),
      });

      handleAuthError(res);

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 409) {
          throw new Error("El proveedor ya existe");
        } else if (res.status === 403) {
          throw new Error(errorData.msg || "No tienes permisos para crear proveedores");
        } else {
          throw new Error(errorData.msg || "Error al guardar proveedor");
        }
      }

      return await res.json();
    } catch (error) {
      console.error("❌ Error en guardarProveedor:", error);
      throw error;
    }
  },

  // Obtener proveedores (público)
  obtenerProveedores: async (useAuth = false) => {
    try {
      const endpoint = useAuth ? '/auth/obtenertodos' : '/obtenertodos';
      const headers = useAuth ? getAuthHeaders(false) : {};
      
      const res = await fetch(`${API_URL}/proveedores${endpoint}`, { headers });
      
      if (useAuth) handleAuthError(res);
      if (!res.ok) throw new Error("Error al obtener proveedores");
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en obtenerProveedores:", error);
      throw error;
    }
  },

  // Obtener proveedor por ID (público)
  obtenerProveedorPorId: async (id, useAuth = false) => {
    try {
      const endpoint = useAuth ? `/auth/por/${id}` : `/por/${id}`;
      const headers = useAuth ? getAuthHeaders(false) : {};
      
      const res = await fetch(`${API_URL}/proveedores${endpoint}`, { headers });
      
      if (useAuth) handleAuthError(res);
      if (!res.ok) throw new Error("Error al obtener proveedor por ID");
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en obtenerProveedorPorId:", error);
      throw error;
    }
  },

  // Actualizar proveedor (solo admin y gerente)
  actualizarProveedor: async (id, datos) => {
    try {
      const res = await fetch(`${API_URL}/proveedores/actualizar/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(datos),
      });
      
      handleAuthError(res);
      
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 403) {
          throw new Error(errorData.msg || "No tienes permisos para actualizar proveedores");
        }
        throw new Error(errorData.msg || "Error al actualizar proveedor");
      }
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en actualizarProveedor:", error);
      throw error;
    }
  },

  // Eliminar proveedor (solo admin y gerente)
  eliminarProveedor: async (id) => {
    try {
      const res = await fetch(`${API_URL}/proveedores/eliminar/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
      });
      
      handleAuthError(res);
      
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 403) {
          throw new Error(errorData.msg || "No tienes permisos para eliminar proveedores");
        }
        throw new Error(errorData.msg || "Error al eliminar proveedor");
      }
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en eliminarProveedor:", error);
      throw error;
    }
  },

  // ================= PRODUCTOS =================
  // Crear producto (solo admin y gerente)
  guardarProducto: async (formData) => {
    try {
      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const res = await fetch(`${API_URL}/productos/guardarProducto`, {
        method: "POST",
        headers,
        body: formData, // Contiene imagen y demás datos
      });
      
      handleAuthError(res);
      
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 403) {
          throw new Error(errorData.msg || "No tienes permisos para crear productos");
        }
        throw new Error(errorData.msg || "Error al guardar producto");
      }
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en guardarProducto:", error);
      throw error;
    }
  },

  // Obtener productos (público)
  obtenerProductos: async (useAuth = false) => {
    try {
      const endpoint = useAuth ? '/auth/todosProductos' : '/todosProductos';
      const headers = useAuth ? getAuthHeaders(false) : {};
      
      const res = await fetch(`${API_URL}/productos${endpoint}`, { headers });
      
      if (useAuth) handleAuthError(res);
      if (!res.ok) throw new Error("Error al obtener productos");
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en obtenerProductos:", error);
      throw error;
    }
  },

  // Obtener producto por ID (público)
  obtenerProductoPorId: async (id, useAuth = false) => {
    try {
      const endpoint = useAuth ? `/auth/porId/${id}` : `/porId/${id}`;
      const headers = useAuth ? getAuthHeaders(false) : {};
      
      const res = await fetch(`${API_URL}/productos${endpoint}`, { headers });
      
      if (useAuth) handleAuthError(res);
      if (!res.ok) throw new Error("Error al obtener producto por ID");
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en obtenerProductoPorId:", error);
      throw error;
    }
  },

  // Actualizar producto (solo admin y gerente)
  actualizarProducto: async (id, formData) => {
    try {
      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const res = await fetch(`${API_URL}/productos/actualizar/${id}`, {
        method: "PATCH",
        headers,
        body: formData,
      });
      
      handleAuthError(res);
      
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 403) {
          throw new Error(errorData.msg || "No tienes permisos para actualizar productos");
        }
        throw new Error(errorData.msg || "Error al actualizar producto");
      }
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en actualizarProducto:", error);
      throw error;
    }
  },

  // Eliminar producto (solo admin y gerente)
  eliminarProducto: async (id) => {
    try {
      const res = await fetch(`${API_URL}/productos/eliminar/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
      });
      
      handleAuthError(res);
      
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 403) {
          throw new Error(errorData.msg || "No tienes permisos para eliminar productos");
        }
        throw new Error(errorData.msg || "Error al eliminar producto");
      }
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en eliminarProducto:", error);
      throw error;
    }
  },

  // ================= USUARIOS =================
  // Obtener todos los usuarios (solo admin)
  obtenerUsuarios: async () => {
    try {
      const res = await fetch(`${API_URL}/register/todos`, {
        method: "GET",
        headers: getAuthHeaders(false),
      });
      
      handleAuthError(res);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Error al obtener usuarios");
      }
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en obtenerUsuarios:", error);
      throw error;
    }
  },

  // Actualizar usuario (cambiar rol, correo, etc.)
  actualizarUsuario: async (id, datos) => {
    try {
      const res = await fetch(`${API_URL}/register/actualizar/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(datos),
      });
      
      handleAuthError(res);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Error al actualizar usuario");
      }
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en actualizarUsuario:", error);
      throw error;
    }
  },

  // Eliminar usuario (solo admin)
  eliminarUsuario: async (id) => {
    try {
      const res = await fetch(`${API_URL}/register/eliminar/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
      });
      
      handleAuthError(res);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Error al eliminar usuario");
      }
      
      return await res.json();
    } catch (error) {
      console.error("❌ Error en eliminarUsuario:", error);
      throw error;
    }
  },

  // ================= SUBIDA DE IMAGEN =================
  subirImagen: async (formData) => {
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Error al subir imagen");
      return await res.json();
    } catch (error) {
      console.error("❌ Error en subirImagen:", error);
      throw error;
    }
  },
};

export default api;
