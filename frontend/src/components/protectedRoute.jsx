import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ 
  children, 
  requiredRoles = null,
  requireCRUD = false,
  isAuthenticated // Para compatibilidad con el sistema anterior
}) {
  const { user, loading, isAuthenticated: authIsAuthenticated, hasRole, canPerformCRUD } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // Verificar autenticación (compatibilidad con sistema anterior)
  const storedAuth = localStorage.getItem("isAuthenticated");
  const userIsAuthenticated = authIsAuthenticated || isAuthenticated || storedAuth === "true";

  if (!userIsAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Verificar roles específicos si se requieren
  if (requiredRoles) {
    const userHasRequiredRole = hasRole(requiredRoles);
    if (!userHasRequiredRole) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          textAlign: 'center'
        }}>
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta página.</p>
          <p>Rol requerido: {Array.isArray(requiredRoles) ? requiredRoles.join(' o ') : requiredRoles}</p>
          <p>Tu rol actual: {user.rol}</p>
          <button onClick={() => window.history.back()}>Volver</button>
        </div>
      );
    }
  }

  // Verificar si se requieren permisos CRUD (admin o gerente)
  if (requireCRUD && !canPerformCRUD()) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        textAlign: 'center'
      }}>
        <h2>Permisos Insuficientes</h2>
        <p>Esta página requiere permisos de administrador o gerente.</p>
        <p>Tu rol actual: {user.rol}</p>
        <button onClick={() => window.history.back()}>Volver</button>
      </div>
    );
  }

  return children;
}
