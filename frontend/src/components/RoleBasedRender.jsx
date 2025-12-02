import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Componente para renderizar contenido basado en roles y permisos
 */
const RoleBasedRender = ({ 
  children, 
  roles = null, 
  requireCRUD = false,
  fallback = null,
  showFallback = true 
}) => {
  const { user, hasRole, canPerformCRUD } = useAuth();

  // Si no hay usuario autenticado
  if (!user) {
    return showFallback ? (fallback || <div>No autenticado</div>) : null;
  }

  // Verificar si se requieren permisos CRUD
  if (requireCRUD && !canPerformCRUD()) {
    return showFallback ? (
      fallback || (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          color: '#856404'
        }}>
          Esta función requiere permisos de administrador o gerente.
        </div>
      )
    ) : null;
  }

  // Verificar roles específicos
  if (roles && !hasRole(roles)) {
    return showFallback ? (
      fallback || (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          No tienes permisos para ver este contenido. 
          Rol requerido: {Array.isArray(roles) ? roles.join(' o ') : roles}
        </div>
      )
    ) : null;
  }

  // Si pasa todas las verificaciones, renderizar el contenido
  return children;
};

/**
 * Hook personalizado para verificar permisos
 */
export const usePermissions = () => {
  const { user, hasRole, canPerformCRUD, isCajero } = useAuth();

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: hasRole('admin'),
    isGerente: hasRole('gerente'),
    isCajero: isCajero(),
    canCreate: canPerformCRUD(),
    canEdit: canPerformCRUD(),
    canDelete: canPerformCRUD(),
    canView: !!user, // Todos los usuarios autenticados pueden ver
    hasRole,
    canPerformCRUD
  };
};

/**
 * Componente botón con permisos
 */
export const PermissionButton = ({ 
  children, 
  onClick, 
  roles = null,
  requireCRUD = false,
  disabled = false,
  className = "",
  style = {},
  ...props 
}) => {
  const { hasRole, canPerformCRUD } = useAuth();

  // Verificar permisos
  const hasPermission = () => {
    if (requireCRUD && !canPerformCRUD()) return false;
    if (roles && !hasRole(roles)) return false;
    return true;
  };

  const isDisabled = disabled || !hasPermission();

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={className}
      style={{
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        ...style
      }}
      title={!hasPermission() ? 'No tienes permisos para esta acción' : ''}
      {...props}
    >
      {children}
    </button>
  );
};

export default RoleBasedRender;