// src/api/api.js

const API_URL = "http://localhost:3000/api/v1";

const api = {
  // ================= PROVEEDORES =================
  guardarProveedor: async (proveedor) => {
  try {
    const res = await fetch(`${API_URL}/proveedores/guardarProveedor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedor),
    });

    if (!res.ok) {
      if (res.status === 409) {
        throw new Error("El proveedor ya existe");
      } else {
        throw new Error("Error al guardar proveedor");
      }
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error en guardarProveedor:", error);
    throw error;
  }
},
  obtenerProveedores: async () => {
    try {
      const res = await fetch(`${API_URL}/proveedores/obtenertodos`);
      if (!res.ok) throw new Error("Error al obtener proveedores");
      return await res.json();
    } catch (error) {
      console.error("❌ Error en obtenerProveedores:", error);
      throw error;
    }
  },

  obtenerProveedorPorId: async (id) => {
    try {
      const res = await fetch(`${API_URL}/proveedores/por/${id}`);
      if (!res.ok) throw new Error("Error al obtener proveedor por ID");
      return await res.json();
    } catch (error) {
      console.error("❌ Error en obtenerProveedorPorId:", error);
      throw error;
    }
  },

  actualizarProveedor: async (id, datos) => {
    try {
      const res = await fetch(`${API_URL}/proveedores/actualizar/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!res.ok) throw new Error("Error al actualizar proveedor");
      return await res.json();
    } catch (error) {
      console.error("❌ Error en actualizarProveedor:", error);
      throw error;
    }
  },

  eliminarProveedor: async (id) => {
    try {
      const res = await fetch(`${API_URL}/proveedores/eliminar/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar proveedor");
      return await res.json();
    } catch (error) {
      console.error("❌ Error en eliminarProveedor:", error);
      throw error;
    }
  },

  // ================= PRODUCTOS =================
  guardarProducto: async (formData) => {
    try {
      const res = await fetch(`${API_URL}/productos/guardarProducto`, {
        method: "POST",
        body: formData, // Contiene imagen y demás datos
      });
      if (!res.ok) throw new Error("Error al guardar producto");
      return await res.json();
    } catch (error) {
      console.error("❌ Error en guardarProducto:", error);
      throw error;
    }
  },

  obtenerProductos: async () => {
    try {
      const res = await fetch(`${API_URL}/productos/todosProductos`);
      if (!res.ok) throw new Error("Error al obtener productos");
      return await res.json();
    } catch (error) {
      console.error("❌ Error en obtenerProductos:", error);
      throw error;
    }
  },

  obtenerProductoPorId: async (id) => {
    try {
      const res = await fetch(`${API_URL}/productos/porId/${id}`);
      if (!res.ok) throw new Error("Error al obtener producto por ID");
      return await res.json();
    } catch (error) {
      console.error("❌ Error en obtenerProductoPorId:", error);
      throw error;
    }
  },

  actualizarProducto: async (id, formData) => {
    try {
      const res = await fetch(`${API_URL}/productos/actualizar/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) throw new Error("Error al actualizar producto");
      return await res.json();
    } catch (error) {
      console.error("❌ Error en actualizarProducto:", error);
      throw error;
    }
  },

  eliminarProducto: async (id) => {
    try {
      const res = await fetch(`${API_URL}/productos/eliminar/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      return await res.json();
    } catch (error) {
      console.error("❌ Error en eliminarProducto:", error);
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
