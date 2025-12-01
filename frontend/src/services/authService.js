//Funcion del login

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
    return data; // { msg: "Login exitoso", usuario: { id, nombre, rol } }
    
  } catch (error) {
    // Esto lo atrapará el LoginPage o el AuthContext
    throw error;
  }
}

// Función para verificar si el usuario es admin
export function isUserAdmin(loginResponse) {
  // Verificamos si la respuesta tiene la estructura correcta y si el rol es admin
  return loginResponse?.usuario?.rol === "admin";
}

// Función del registro
export async function registerRequest(email, password) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
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
