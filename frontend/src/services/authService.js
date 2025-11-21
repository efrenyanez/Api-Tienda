//Funcion del login

/* export async function loginRequest(email, password) {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    // Si la API responde con error (400, 401, etc)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Credenciales incorrectas");
    }

    // Si todo está bien…
    const data = await response.json();
    return data; // { user, token }
    
  } catch (error) {
    // Esto lo atrapará el LoginPage o el AuthContext
    throw error;
  }
} */

//Simulacion
export async function loginRequest(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Usuario admin
      if (email === "admin@admin.com" && password === "admin123") {
        resolve({
          user: {
            id: 1,
            name: "Administrador",
            email: email,
            role: "admin"
          },
          token: "fake-admin-token-123",
          isAdmin: true
        });
      }
      // Usuario demo normal
      else if (email === "demo@demo.com" && password === "123456") {
        resolve({
          user: {
            id: 2,
            name: "Usuario Demo",
            email: email,
            role: "user"
          },
          token: "fake-user-token-123",
          isAdmin: false
        });
      } else {
        reject(new Error("Credenciales incorrectas"));
      }
    }, 1000);
  });
}

// Función para verificar si un usuario es admin
export function isUserAdmin(userData) {
  return userData?.user?.role === "admin" || userData?.isAdmin === true;
}

//Funcion del registro - Simulacion
export async function registerRequest(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular validaciones
      if (!email || !password) {
        reject(new Error("Todos los campos son requeridos"));
        return;
      }
      
      if (!email.includes("@") || !email.includes(".")) {
        reject(new Error("El correo no es válido"));
        return;
      }
      
      if (password.length < 6) {
        reject(new Error("La contraseña debe tener al menos 6 caracteres"));
        return;
      }
      
      // Simular que el email ya existe
      if (email === "demo@demo.com") {
        reject(new Error("Este correo ya está registrado"));
        return;
      }
      
      // Registro exitoso - usuarios registrados son siempre usuarios normales
      resolve({
        user: {
          id: Math.floor(Math.random() * 1000),
          email: email,
          role: "user"
        },
        token: "fake-token-" + Math.random().toString(36).substr(2, 9),
        isAdmin: false
      });
    }, 1500);
  });
}
