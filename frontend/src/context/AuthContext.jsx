import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para decodificar JWT manualmente (sin verificar)
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  };

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initAuth = () => {
      if (token) {
        try {
          const decoded = decodeJWT(token);
          
          if (decoded && decoded.exp * 1000 > Date.now()) {
            // Token válido y no expirado
            setUser({
              id: decoded.id,
              correo: decoded.correo,
              rol: decoded.rol
            });
            setIsAuthenticated(true);
          } else {
            // Token expirado
            logout();
          }
        } catch (error) {
          console.error('Error verificando token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // Función de login
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email, contraseña: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token
        setToken(data.token);
        localStorage.setItem('token', data.token);
        
        // Guardar información del usuario
        setUser(data.usuario);
        setIsAuthenticated(true);
        
        // También mantener compatibilidad con el sistema anterior
        localStorage.setItem('userRole', data.usuario.rol);
        localStorage.setItem('isAuthenticated', 'true');
        
        return { success: true, data };
      } else {
        return { success: false, message: data.msg };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error de conexión' };
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (requiredRole) => {
    if (!user || !user.rol) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.rol);
    }
    
    return user.rol === requiredRole;
  };

  // Función para verificar si el usuario puede realizar operaciones CRUD
  const canPerformCRUD = () => {
    return hasRole(['admin', 'gerente']);
  };

  // Función para verificar si el usuario es cajero (solo lectura)
  const isCajero = () => {
    return hasRole('cajero');
  };

  // Función para verificar si el token está próximo a expirar
  const isTokenExpiringSoon = () => {
    if (!token) return false;
    
    const decoded = decodeJWT(token);
    if (!decoded) return false;
    
    const now = Date.now();
    const exp = decoded.exp * 1000;
    const timeUntilExpiry = exp - now;
    
    // Retorna true si expira en menos de 5 minutos
    return timeUntilExpiry < 5 * 60 * 1000;
  };

  // Función de debug para verificar estado del token
  const debugToken = () => {
    if (!token) {
      console.log('🔍 DEBUG: No hay token');
      return null;
    }
    
    const decoded = decodeJWT(token);
    if (!decoded) {
      console.log('🔍 DEBUG: Token inválido');
      return null;
    }
    
    const now = Date.now();
    const exp = decoded.exp * 1000;
    const iat = decoded.iat * 1000;
    const timeUntilExpiry = exp - now;
    
    /* console.log('🔍 DEBUG Token Info:', {
      usuario: decoded.correo,
      rol: decoded.rol,
      emitido: new Date(iat).toLocaleString(),
      expira: new Date(exp).toLocaleString(),
      tiempoRestante: Math.round(timeUntilExpiry / 1000) + ' segundos',
      expirado: timeUntilExpiry <= 0
    }); */
    
    return {
      decoded,
      timeUntilExpiry,
      isExpired: timeUntilExpiry <= 0
    };
  };

  // Verificar expiración cada 5 segundos
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      const tokenInfo = debugToken();
      if (tokenInfo && tokenInfo.isExpired) {
        console.log('🚨 TOKEN EXPIRADO - Cerrando sesión automáticamente');
        logout();
      }
    }, 5000); // Verificar cada 5 segundos

    return () => clearInterval(interval);
  }, [token]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    canPerformCRUD,
    isCajero,
    isTokenExpiringSoon,
    debugToken, // Función de debug
    
    // Funciones de compatibilidad
    setIsAuthenticated: (value) => setIsAuthenticated(value),
    setUserRole: (role) => {
      if (user) {
        setUser({ ...user, rol: role });
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
