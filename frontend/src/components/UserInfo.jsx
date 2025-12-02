import React from 'react';
import { useAuth } from '../context/AuthContext';
import { logoutRequest } from '../services/authService';

const UserInfo = () => {
  const { user, logout, isTokenExpiringSoon } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutRequest();
      logout();
    } catch (error) {
      console.error('Error en logout:', error);
      // Aún así hacer logout local
      logout();
    }
  };

  if (!user) return null;

  const getRoleBadgeColor = (rol) => {
    switch (rol) {
      case 'admin':
        return '#e74c3c'; // Rojo
      case 'gerente':
        return '#f39c12'; // Naranja
      case 'cajero':
        return '#3498db'; // Azul
      default:
        return '#95a5a6'; // Gris
    }
  };

  const getRolePermissions = (rol) => {
    switch (rol) {
      case 'admin':
        return 'Acceso completo (CRUD)';
      case 'gerente':
        return 'Acceso completo (CRUD)';
      case 'cajero':
        return 'Solo lectura';
      default:
        return 'Sin permisos';
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '10px 15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      {/* Información del usuario */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '4px'
        }}>
          <strong>{user.correo}</strong>
          <span style={{
            backgroundColor: getRoleBadgeColor(user.rol),
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {user.rol?.toUpperCase()}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#6c757d' }}>
          {getRolePermissions(user.rol)}
        </div>
        
        {/* Advertencia de token próximo a expirar */}
        {isTokenExpiringSoon() && (
          <div style={{
            fontSize: '11px',
            color: '#e74c3c',
            fontWeight: 'bold',
            marginTop: '4px'
          }}>
            ⚠️ Tu sesión expira pronto
          </div>
        )}
      </div>

      {/* Botón de logout */}
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default UserInfo;