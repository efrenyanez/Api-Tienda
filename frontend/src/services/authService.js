//Funcion del login con JWT

export async function loginRequest(email, password) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correo: email, contraseña: password })
    });

    // Si la API responde con error (400, 404, etc)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Error en las credenciales");
    }

    // Si todo está bien, devolvemos la respuesta del controlador
    const data = await response.json();
    return data; // { msg: "Login exitoso", token: "jwt...", usuario: { id, correo, rol } }
    
  } catch (error) {
    // Esto lo atrapará el LoginPage o el AuthContext
    throw error;
  }
}

// Funciones de verificación de roles
export function isUserAdmin(loginResponse) {
  return loginResponse?.usuario?.rol === "admin";
}

export function isUserGerente(loginResponse) {
  return loginResponse?.usuario?.rol === "gerente";
}

export function isUserCajero(loginResponse) {
  return loginResponse?.usuario?.rol === "cajero";
}

export function canUserPerformCRUD(loginResponse) {
  const rol = loginResponse?.usuario?.rol;
  return rol === "admin" || rol === "gerente";
}

// Función para verificar token JWT
export async function verifyToken(token) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      return { valid: false, message: "Token inválido" };
    }

    const data = await response.json();
    return { valid: true, payload: data.payload };
    
  } catch (error) {
    return { valid: false, message: error.message };
  }
}

// Función para obtener información del usuario actual
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token');

    const response = await fetch("http://localhost:3000/api/v1/auth/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Token inválido o expirado');
    }

    const data = await response.json();
    return data.usuario;
    
  } catch (error) {
    throw error;
  }
}

// Función de logout
export async function logoutRequest() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await fetch("http://localhost:3000/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    }
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    
  } catch (error) {
    // Aunque falle la petición, limpiamos el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
  }
}

// Función del registro
export async function registerRequest(nombre, email, password) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        nombre: nombre,
        correo: email, 
        contraseña: password
        // El rol será asignado posteriormente por el administrador
      })
    });

    // Si la API responde con error (400, 500, etc)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Error al registrar usuario");
    }

    // Si todo está bien, devolvemos la respuesta del controlador
    const data = await response.json();
    return data; // { msg: "Usuario registrado", usuario: { nombre, correo, rol, etc. } }
    
  } catch (error) {
    // Esto lo atrapará el RegisterPage
    throw error;
  }
}
